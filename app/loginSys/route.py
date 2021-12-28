from flask import render_template
from flask import Flask, request,make_response, jsonify
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5 as Cipher_pkcs1_v1_5
from Crypto import Random
import datetime
import json
import base64
from ldap3 import Connection, Server, ALL
import psycopg2
import psycopg2.extras
import csv
import os

D_rsaKeyPool = {}
D_IDtoCNCSV = {}

MAIN_DOMAIN = '34.80.222.210'

pgdb_config={
    'host':'34.80.222.210',
    'port':5432,
    'user':'admin',
    'password':'admin',
    'database':'TreeStudio',
}


def loadIDtoCNCSV():
    with open(os.path.join(os.path.split(os.path.realpath(__file__))[0],'LDAP_LoginList.csv'), newline='') as csvfile:
        rows = csv.DictReader(csvfile)
        for row in rows:
            try:
                D_IDtoCNCSV[row['uid']] = row['dn']
            except:
                pass
loadIDtoCNCSV()

def get_data_from_pgdb(sqls):
    conn = psycopg2.connect(**pgdb_config)
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute(sqls)
    result = cursor.fetchall()
    conn.commit()
    conn.close()
    return result

def write_sql_to_pgdb(sqls):
    conn = psycopg2.connect(**pgdb_config)
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute(sqls)
    conn.commit()
    conn.close()

def SetNewLoginToken(S_userName):
    sql_command="""
    UPDATE 
        public.loginsys_autologin 
    SET 
        created=now(), last_connect_time=now() ,cookie_token=uuid_generate_v4() 
    WHERE 
        user_name='{user}';

    INSERT INTO 
        public.loginsys_autologin(
            user_name
        )
    SELECT 
        ('{user}')
    WHERE 
        NOT EXISTS ( 
            SELECT user_name FROM public.loginsys_autologin WHERE user_name='{user}'
        );
    """.format(user=S_userName)
    write_sql_to_pgdb(sql_command)

    S_cookie_token = GetLoginTokenByUserName(S_userName)

    return S_cookie_token

def GetLoginTokenByUserName(S_userName):
    sql_command = """
    SELECT *
    FROM 
        public.loginsys_autologin
    WHERE 
        user_name='{user}';
    """.format(user=S_userName)
    loginInfo = get_data_from_pgdb(sql_command)
    if len(loginInfo) != 1:
        return None
    else:
        return dict(loginInfo[0])['cookie_token']

def GetLoginTokenByLoginToken(cookie_token):
    sql_command = """
    SELECT *
    FROM 
        public.loginsys_autologin
    WHERE 
        cookie_token='{cookie_token}';
    """.format(cookie_token=cookie_token)
    loginInfo = get_data_from_pgdb(sql_command)
    if len(loginInfo) != 1:
        return None
    else:
        return dict(loginInfo[0])['user_name']

def loginPage():
    return render_template('loginPage.html')

def clearOldKeys():
    try:
        timeDeatLine = datetime.datetime.now() - datetime.timedelta(minutes=5)
        for S_key in D_rsaKeyPool.keys():
            if D_rsaKeyPool.get(S_key, None) != None:
                if D_rsaKeyPool[S_key].get("create_time") < timeDeatLine:
                    del D_rsaKeyPool[S_key]
    except:
        pass
# https://www.itread01.com/content/1544584347.html
def getPublickey():
    clearOldKeys()
    RANDOM_GENERATOR=Random.new().read
    rsa = RSA.generate(1024, RANDOM_GENERATOR)
    PRIVATE_PEM = rsa.exportKey()
    # print(PRIVATE_PEM)
    PUBLIC_PEM = rsa.publickey().exportKey().decode("utf-8").replace('\n','')
    # (publickey,privatekey)=rsa.newkeys(1000)
    # pub = publickey.save_pkcs1()
    D_rsaKeyPool[PUBLIC_PEM] = {
        'create_time': datetime.datetime.now(),
        'privatekey' : PRIVATE_PEM,
        'random_generator' : RANDOM_GENERATOR,
    }
    # print(pub.decode("utf-8").replace('\n',''))
    return json.dumps({'result': 'success', 'data':{'Publickey':PUBLIC_PEM}}, default=str)

def decodePassword(password, pubKey):
    clearOldKeys()

    privateKey = D_rsaKeyPool.get(pubKey)['privatekey']

    rsakey = RSA.importKey(privateKey)
    cipher = Cipher_pkcs1_v1_5.new(rsakey)
    #使用base64解密，(在前端js加密時自動是base64加密)
    text = cipher.decrypt(
        base64.b64decode(password), 
        D_rsaKeyPool.get(pubKey)['random_generator']
    ).decode("utf-8")
    return text

def GetLoginInfo():
    try:
        if request.method == 'POST':
            server=Server(
                "34.80.222.210", 
                port=8389, 
                get_info=ALL
            )
            try:
                S_account = request.form.get('account')
                if D_IDtoCNCSV.get(S_account, None) == None:
                    return json.dumps({'result': 'fail', 'data': {'message': '找不到此帳號'}})
                S_dn = D_IDtoCNCSV.get(S_account)



                conn = Connection(
                    server,
                    user=S_dn,
                    password=decodePassword(request.form.get('password'), request.form.get('pubKey')),
                    read_only=True,                
                    auto_bind=True
                )
                token = SetNewLoginToken(conn.extend.standard.who_am_i())
                if token:
                    resp = make_response(jsonify(
                        {'result': 'success', 'data': {'token': token}}
                    ))
                    resp.set_cookie(key='treesys-login-token', value=token)

                    return resp
                else:
                    return json.dumps({'result': 'fail', 'data': {'message': '登入系統錯誤'}})
            except Exception as e:
                return json.dumps({'result': 'fail', 'data': {'message': str(e)}})

        else:
            return json.dumps({'result': 'fail', 'data': {'message': '只允許POST'}})
    except Exception as e:
        return json.dumps({'result': 'fail', 'data': {'message': str(e)}})

def checkLoginInfo():
    try:
        S_loginToken = request.headers.get('treesys-login-token')
        loginInfo = GetLoginTokenByLoginToken(S_loginToken)
        if loginInfo:
            return json.dumps({'result': 'success', 'data': {'message': loginInfo}})
        else:
            return json.dumps({'result': 'change', 'data': {'message': '找不到登入資訊'}})
    except Exception as e:
        return json.dumps({'result': 'fail', 'data': {'message': str(e)}})


