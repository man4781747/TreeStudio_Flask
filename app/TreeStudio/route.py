from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask import render_template
import json
import datetime
import psycopg2
import psycopg2.extras

pgdb_config={
    'host':'34.80.222.210',
    'port':5432,
    'user':'admin',
    'password':'admin',
    'database':'TreeStudio',
}

def get_data_from_pgdb(sqls):
    conn = psycopg2.connect(**pgdb_config)
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute(sqls)
    result = cursor.fetchall()
    conn.commit()
    conn.close()
    if result:
        return result

def write_sql_to_pgdb(sqls):
    conn = psycopg2.connect(**pgdb_config)
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute(sqls)
    conn.commit()
    conn.close()

def init_dbs():
    try:
        write_sql_to_pgdb('CREATE EXTENSION "uuid-ossp";')
    except:
        pass
    init_announcement_list_db()
    init_loginsys_autologin_db()
    init_ordersys_orderinfo_db()
    init_ordersys_shopcartinfo_db()
    init_ordersys_shopinfo_db()

def init_announcement_list_db():
    write_sql_to_pgdb("""
    CREATE TABLE IF NOT EXISTS public.announcement_list
    (
        created timestamp with time zone NOT NULL DEFAULT now(),
        who text COLLATE pg_catalog."default" NOT NULL,
        title text COLLATE pg_catalog."default" NOT NULL,
        content text COLLATE pg_catalog."default",
        last_modify_date timestamp with time zone NOT NULL DEFAULT now(),
        id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
        is_delete boolean NOT NULL DEFAULT false,
        CONSTRAINT announcement_list_pkey PRIMARY KEY (id)
    )
    WITH (
        OIDS = FALSE
    )
    TABLESPACE pg_default;

    ALTER TABLE IF EXISTS public.announcement_list
    OWNER to admin;
    """)

def init_loginsys_autologin_db():
    write_sql_to_pgdb("""
    CREATE TABLE IF NOT EXISTS public.loginsys_autologin
    (
        cookie_token text COLLATE pg_catalog."default" NOT NULL DEFAULT uuid_generate_v4(),
        created timestamp with time zone NOT NULL DEFAULT now(),
        last_connect_time timestamp with time zone NOT NULL DEFAULT now(),
        user_name text COLLATE pg_catalog."default" NOT NULL
    )
    WITH (
        OIDS = FALSE
    )
    TABLESPACE pg_default;

    ALTER TABLE IF EXISTS public.loginsys_autologin
    OWNER to admin;
    """)

def init_ordersys_orderinfo_db():
    write_sql_to_pgdb("""
    CREATE TABLE IF NOT EXISTS public.ordersys_orderinfo
    (
        created timestamp with time zone NOT NULL DEFAULT now(),
        order_id text COLLATE pg_catalog."default" NOT NULL,
        owner_name text COLLATE pg_catalog."default",
        close_time text COLLATE pg_catalog."default" DEFAULT ''::text,
        bank_info text COLLATE pg_catalog."default",
        bank_info_qr_code text COLLATE pg_catalog."default",
        shop_id text COLLATE pg_catalog."default",
        order_description text COLLATE pg_catalog."default",
        alive boolean NOT NULL DEFAULT true,
        is_delete boolean NOT NULL DEFAULT false,
        last_modify_date timestamp with time zone NOT NULL DEFAULT now(),
        CONSTRAINT ordersys_orderinfo_pkey PRIMARY KEY (created, order_id, alive, is_delete, last_modify_date)
    )
    WITH (
        OIDS = FALSE
    )
    TABLESPACE pg_default;

    ALTER TABLE IF EXISTS public.ordersys_orderinfo
    OWNER to admin;
    """)

def init_ordersys_shopcartinfo_db():
    write_sql_to_pgdb("""
    CREATE TABLE IF NOT EXISTS public.ordersys_shopcartinfo
    (
        created timestamp with time zone NOT NULL DEFAULT now(),
        shopper_name text COLLATE pg_catalog."default",
        order_id text COLLATE pg_catalog."default" NOT NULL,
        item_name text COLLATE pg_catalog."default" NOT NULL,
        item_number integer NOT NULL,
        item_price integer NOT NULL,
        item_content text COLLATE pg_catalog."default" DEFAULT ''::text,
        item_index integer NOT NULL,
        pay boolean NOT NULL DEFAULT false,
        is_delete boolean NOT NULL DEFAULT false,
        last_modify_date timestamp with time zone NOT NULL DEFAULT now(),
        shop_cart_id text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text
    )
    WITH (
        OIDS = FALSE
    )
    TABLESPACE pg_default;

    ALTER TABLE IF EXISTS public.ordersys_shopcartinfo
    OWNER to admin;
    """)

def init_ordersys_shopinfo_db():
    write_sql_to_pgdb("""
    CREATE TABLE IF NOT EXISTS public.ordersys_shopinfo
    (
        created timestamp with time zone NOT NULL DEFAULT now(),
        shop_id text COLLATE pg_catalog."default" NOT NULL,
        shop_type text COLLATE pg_catalog."default",
        shop_name text COLLATE pg_catalog."default",
        "shop_phoneNum" text COLLATE pg_catalog."default",
        shop_address text COLLATE pg_catalog."default",
        shop_description text COLLATE pg_catalog."default",
        shop_menu text COLLATE pg_catalog."default",
        shop_picture text COLLATE pg_catalog."default",
        is_delete boolean DEFAULT false,
        last_modify_date timestamp with time zone DEFAULT now(),
        CONSTRAINT ordersys_shopinfo_pkey PRIMARY KEY (created, shop_id)
    )
    WITH (
        OIDS = FALSE
    )
    TABLESPACE pg_default;

    ALTER TABLE IF EXISTS public.ordersys_shopinfo
    OWNER to admin;
    """)

init_dbs()
# 非API區塊

def deleteShopInfoByShopID(shop_id):
    # 刪除商店資訊，必須連對應的團訂單一起"標記為"刪除
    ShopInfoGet = get_data_from_pgdb("""
        select order_id
        from public.ordersys_orderinfo
        WHERE shop_id='{shop_id}'
    """.format(shop_id=shop_id))
    L_returnList = [dict(data) for data in ShopInfoGet] 
    for D_data in L_returnList:
        deleteOrderInfoByOrderID(D_data['order_id'])
    print('Del shop: {}'.format(shop_id))
    write_sql_to_pgdb(
    """
        UPDATE public.ordersys_shopinfo
        SET 
            is_delete=true
        WHERE shop_id='{shop_id}';
    """.format(
            shop_id = shop_id,
        )
    )

def deleteOrderInfoByOrderID(order_id):
    # 刪除團單，必須連購物車單一起"標記為"刪除
    deleteAllShopCartByOrderID(order_id)
    print('Del order: {}'.format(order_id))
    write_sql_to_pgdb(
    """
        UPDATE public.ordersys_orderinfo
        SET 
            is_delete=true
        WHERE order_id='{order_id}';
    """.format(
            order_id = order_id,
        )
    )

def deleteAllShopCartByOrderID(order_id):
    write_sql_to_pgdb(
    """
        UPDATE public.ordersys_shopcartinfo
        SET 
            is_delete=true
        WHERE order_id='{order_id}';
    """.format(
            order_id = order_id,
        )
    )

def home():
    return render_template('TreeStudio_mainHTML.html')

def OrderSys_ShopInfo_Manager(shop_id=None):
    try:
        if request.method == 'POST':
            if shop_id == None:
                write_sql_to_pgdb(
                    """
                        INSERT INTO ordersys_shopinfo 
                        (shop_id, shop_type, shop_name, "shop_phoneNum", shop_address, shop_description, shop_menu, shop_picture) 
                        VALUES 
                        ('{shop_id}', '{shop_type}', '{shop_name}', '{shop_phoneNum}', '{shop_address}', '{shop_description}', '{shop_menu}', '{shop_picture}')
                    """.format(
                    shop_id = request.form.get('shop_id'),
                    shop_type = request.form.get('shop_type'),
                    shop_name = request.form.get('shop_name'),
                    shop_phoneNum = request.form.get('shop_phoneNum'),
                    shop_address = request.form.get('shop_address'),
                    shop_description = request.form.get('shop_description'),
                    shop_menu = request.form.get('shop_menu'),     
                    shop_picture = request.form.get('shop_picture'),  
                    )
                )
                return json.dumps({'result': 'success', 'data': {'message': '新增成功'}})
            else:
                write_sql_to_pgdb(
                """
                    UPDATE public.ordersys_shopinfo
                    SET 
                        shop_type='{shop_type}', 
                        shop_name='{shop_name}', 
                        "shop_phoneNum"='{shop_phoneNum}', 
                        shop_address='{shop_address}', 
                        shop_description='{shop_description}', 
                        shop_menu='{shop_menu}', 
                        shop_picture='{shop_picture}',
                        last_modify_date=now()
                    WHERE shop_id='{shop_id}';
                """.format(
                        shop_id = shop_id,
                        shop_type = request.form.get('shop_type'),
                        shop_name = request.form.get('shop_name'),
                        shop_phoneNum = request.form.get('shop_phoneNum'),
                        shop_address = request.form.get('shop_address'),
                        shop_description = request.form.get('shop_description'),
                        shop_menu = request.form.get('shop_menu'),     
                        shop_picture = request.form.get('shop_picture'), 
                    )
                )
                return json.dumps({'result': 'success', 'data': {'message': '更新成功'}})
    
        if request.method == 'GET':
            if shop_id != None:
                ShopInfoGet = get_data_from_pgdb("""
                    select *
                    from public.ordersys_shopinfo
                    where shop_id='{}'
                """.format(shop_id))
                L_returnList = [dict(data) for data in ShopInfoGet] 

                return json.dumps({'result': 'success', 'data':L_returnList[0]}, default=str)
            else:
                # 若不指定 shop_id 則指回傳最低需求的數據
                simpleShopInfoList = get_data_from_pgdb("""
                    select shop_id, shop_type, shop_name, shop_description, is_delete, last_modify_date
                    from public.ordersys_shopinfo
                    WHERE is_delete=false
                    ORDER BY created
                """)
                L_returnList = [dict(data) for data in simpleShopInfoList] 
                return json.dumps({'result': 'success', 'data':L_returnList}, default=str)

        elif request.method == 'DELETE':
            if shop_id != None:
                deleteShopInfoByShopID(shop_id)
                return json.dumps({'result': 'success', 'data':''})
            else:
                return json.dumps({'result': 'fail', 'data':{'message': '缺少參數: shop_id'}})
        else:
            return json.dumps({'result': 'fail', 'date': {'message': '不正確的HTTP請求method'}})
    except Exception as e:
        return json.dumps({'result': 'fail', 'data': {'message': str(e)}})

def OrderSys_OrderInfo_Manager(order_id=None, shop_cart_id=None, item_index=None, set_value=None):
    try:
        if request.method == 'POST':
            if order_id != None:
                if set_value != None:
                    if set_value=='close':
                        set_value = 'false'
                    elif set_value=='open':
                        set_value = 'true'
                    else:
                        return json.dumps({'result': 'fail', 'data': {'message': '參數錯誤'}})
                    write_sql_to_pgdb(
                    """
                        UPDATE public.ordersys_orderinfo
                        SET 
                            alive={set_value}
                        WHERE order_id='{order_id}';
                    """.format(
                            order_id = order_id,
                            set_value = set_value,
                        )
                    )
                    return json.dumps({'result': 'success', 'data': {'message': ''}})
                return json.dumps({'result': 'success', 'data': {'message': ''}})
            else:
                # 新增全新order
                write_sql_to_pgdb(
                    """
                        INSERT INTO ordersys_orderinfo 
                        (order_id, owner_name, bank_info, bank_info_qr_code, shop_id, order_description)
                        VALUES 
                        ('{order_id}', '{owner_name}', '{bank_info}', '{bank_info_qr_code}', '{shop_id}', '{order_description}')
                    """.format(
                        order_id = request.form.get('order_id'),
                        owner_name = request.form.get('owner_name'),
                        bank_info = request.form.get('bank_info'),
                        bank_info_qr_code = request.form.get('bank_info_qr_code'),
                        shop_id = request.form.get('shop_id'),
                        order_description = request.form.get('order_description'),
                    )
                )

                return json.dumps({'result': 'success', 'data': {'message': '新增成功'}})

        elif request.method == 'GET':
            if order_id != None:
                ShopInfoGet = get_data_from_pgdb("""
                    select *
                    from public.ordersys_orderinfo
                    where order_id='{}'
                """.format(order_id))
                L_returnList = [dict(data) for data in ShopInfoGet] 

                return json.dumps({'result': 'success', 'data':L_returnList[0]}, default=str)
            else:
                # 若不指定 order_id 則指回傳最低需求的數據
                simpleOrderInfoList = get_data_from_pgdb("""
                    select created, order_id, owner_name, close_time, bank_info, bank_info_qr_code, shop_id, order_description, alive, last_modify_date
                    from public.ordersys_orderinfo
                    WHERE is_delete=false
                    ORDER BY created
                """)
                L_returnList = [dict(data) for data in simpleOrderInfoList] 

                return json.dumps({'result': 'success', 'data':L_returnList}, default=str)

        elif request.method == 'DELETE':
            if order_id != None:
                deleteOrderInfoByOrderID(order_id)
                return json.dumps({'result': 'success', 'data':{}})
            else:
                return json.dumps({'result': 'fail', 'data':{'message': '缺少參數: order_id'}})
        
        else:
            return json.dumps({'result': 'fail', 'date': {'message': '不正確的HTTP請求method'}})

    except Exception as e:
        return json.dumps({'result': 'fail', 'data': {'message': str(e)}})

def Get_Today_OrderInfo():
    # 今日訂餐列表 (包含今日訂單(不管有無結單) + 過去還沒結單項目)
    try:
        if request.method == 'GET':

            TodayOrderInfoGet = get_data_from_pgdb(
                """
                SELECT 
                    public.ordersys_orderinfo.created, 
                    public.ordersys_orderinfo.order_id, 
                    public.ordersys_orderinfo.owner_name, 
                    public.ordersys_orderinfo.close_time, 
                    public.ordersys_orderinfo.shop_id, 
                    public.ordersys_orderinfo.alive,
                    public.ordersys_shopinfo.shop_name,
	                public.ordersys_shopinfo.shop_type
                FROM 
                    public.ordersys_orderinfo
                INNER JOIN 
                    public.ordersys_shopinfo
                ON 
                    public.ordersys_shopinfo.shop_id=public.ordersys_orderinfo.shop_id
                WHERE 
                    public.ordersys_orderinfo.is_delete=false AND
                    (public.ordersys_orderinfo.alive=true OR 
                        (public.ordersys_orderinfo.created <= '{end_time}' AND 
                        public.ordersys_orderinfo.created >= '{start_time}')
                    )
                """.format(
                        end_time = (datetime.datetime.now() + datetime.timedelta(days=1)).strftime("%Y-%m-%d+08:00"),
                        start_time = datetime.datetime.now().strftime("%Y-%m-%d+08:00"),
                    ) 
                )
            if TodayOrderInfoGet:
                L_returnList = [dict(data) for data in TodayOrderInfoGet] 

                return json.dumps({'result': 'success', 'data':L_returnList}, default=str)
            return json.dumps({'result': 'success', 'data':[]}, default=str)
        else:
            return json.dumps({'result': 'fail', 'date': {'message': '不正確的HTTP請求method'}})
    except Exception as e:
        return json.dumps({'result': 'fail', 'data': {'message': str(e)}})

def Get_OrderInfo_By_Time_Range(time_range=None):
    try:
        if request.method == 'GET':
            if time_range  == None:
                start = datetime.datetime(1990,1,1)
                end = datetime.datetime(3000,1,1)
            else:
                L_timeRange = time_range.split('to')
                start = datetime.datetime.strptime(L_timeRange[0], "%Y-%m-%d")
                end = datetime.datetime.strptime(L_timeRange[1], "%Y-%m-%d") + datetime.timedelta(days=1)

            TimeRangeOrderInfoGet = get_data_from_pgdb(
                """
                SELECT 
                    public.ordersys_orderinfo.created, 
                    public.ordersys_orderinfo.order_id, 
                    public.ordersys_orderinfo.owner_name, 
                    public.ordersys_orderinfo.close_time, 
                    public.ordersys_orderinfo.shop_id, 
                    public.ordersys_orderinfo.alive,
                    public.ordersys_shopinfo.shop_name,
	                public.ordersys_shopinfo.shop_type
                FROM 
                    public.ordersys_orderinfo
                INNER JOIN 
                    public.ordersys_shopinfo
                ON 
                    public.ordersys_shopinfo.shop_id=public.ordersys_orderinfo.shop_id
                WHERE 
                    public.ordersys_orderinfo.is_delete=false AND
                    (public.ordersys_orderinfo.alive=true OR 
                        (public.ordersys_orderinfo.created <= '{end_time}' AND 
                        public.ordersys_orderinfo.created >= '{start_time}')
                    )
                """.format(
                        end_time = end.strftime("%Y-%m-%d+08:00"),
                        start_time = start.strftime("%Y-%m-%d+08:00"),
                    ) 
                )

            L_returnList = [dict(data) for data in TimeRangeOrderInfoGet] 

            return json.dumps({'result': 'success', 'data':L_returnList}, default=str)
        else:
            return json.dumps({'result': 'fail', 'date': {'message': '不正確的HTTP請求method'}})
    except Exception as e:
        return json.dumps({'result': 'fail', 'data': {'message': str(e)}})

def OrderSys_ShopCart_Manager(shop_cart_id=None,  order_id=None, item_index=None):
    try:
        if request.method == 'POST':
            if shop_cart_id != None:
                if item_index != None:
                    if request.form.get('pay', None) != None:
                        if request.form.get('pay') == 'true':
                            set_value = 'true'
                        else:
                            set_value = 'false'
                        write_sql_to_pgdb(
                        """
                            UPDATE public.ordersys_shopcartinfo
                            SET 
                                pay={set_value}
                            WHERE shop_cart_id='{shop_cart_id}' AND item_index={item_index};
                        """.format(
                                shop_cart_id = shop_cart_id,
                                item_index = item_index,
                                set_value = set_value,
                            )
                        )
                        return json.dumps({'result': 'success', 'data': {'message': '更新成功'}})
                    return json.dumps({'result': 'fail', 'data': {'message': '缺少參數 pay'}})
                return json.dumps({'result': 'fail', 'data': {'message': '缺少參數 item_index'}})
            elif order_id != None:
                # 在團訂單下面新增訂單資訊
                # 檢查訂單是否已結單
                orderInfo = get_data_from_pgdb(
                    """
                    SELECT 
                        order_id, alive, is_delete
                    FROM 
                        public.ordersys_orderinfo
                    WHERE 
                        order_id='{order_id}'
                    LIMIT 1;
                    """.format(order_id = order_id) 
                )
                orderInfo = [dict(data) for data in orderInfo][0]
                print(orderInfo)
                if orderInfo['is_delete'] == True:
                    return json.dumps({'result': 'fail', 'data': {'message': '訂單已被刪除，不可再新增訂單'}})
                elif orderInfo['alive'] == False:
                    return json.dumps({'result': 'fail', 'data': {'message': '訂單已結單，不可再新增訂單'}})

                S_shop_cart_id = request.form.get('shop_cart_id')
                S_shopper_name = request.form.get('shopper_name')
                L_shopCartList = json.loads(request.form.get('shop_cart_data'))
                for item_index,shopCartItem in enumerate(L_shopCartList):

                    # 新增全新shop_cart
                    write_sql_to_pgdb(
                        """
                            INSERT INTO public.ordersys_shopcartinfo
                            (shop_cart_id, shopper_name, order_id, item_name, item_number, item_price, item_content, item_index)
                            VALUES 
                            ('{shop_cart_id}', '{shopper_name}', '{order_id}', '{item_name}', {item_number}, {item_price}, '{item_content}', {item_index})
                        """.format(
                            shop_cart_id = S_shop_cart_id,
                            shopper_name = S_shopper_name,
                            order_id = order_id,
                            item_name = shopCartItem['name'],
                            item_number = int(shopCartItem['number']),
                            item_price = int(shopCartItem['price']),
                            item_content = shopCartItem['content'],
                            item_index = item_index,
                        )
                    )

                    # OrderSys_ShopCartInfo.objects.create(
                    #     shop_cart_id = S_shop_cart_id,
                    #     shopper_name = S_shopper_name,
                    #     order_id = shopCartItem['order_id'],
                    #     item_name = shopCartItem['name'],
                    #     item_number = int(shopCartItem['number']),
                    #     item_price = int(shopCartItem['price']),
                    #     item_content = shopCartItem['content'],
                    #     item_index = item_index,
                    # )
                return json.dumps({'result': 'success', 'data': {'message': '新增成功'}})
            return json.dumps({'result': 'fail', 'data': {'message': '缺少參數'}})
        elif request.method == 'GET':
            if shop_cart_id != None:
                if item_index != None:
                    shopCatrInfoList = get_data_from_pgdb(
                        """
                        SELECT 
                            *
                        FROM 
                            public.ordersys_shopcartinfo
                        WHERE
                            is_delete=false AND shop_cart_id='{shop_cart_id}' AND item_index={item_index}
                        """.format(shop_cart_id = shop_cart_id, item_index=item_index) 
                    )
                    if shopCatrInfoList:
                        shopCatrInfoList = [dict(data) for data in shopCatrInfoList]
                        return json.dumps({'result': 'success', 'data': shopCatrInfoList}, default=str)
                    return json.dumps({'result': 'success', 'data': []}, default=str)
                else:
                    shopCatrInfoList = get_data_from_pgdb(
                        """
                        SELECT 
                            *
                        FROM 
                            public.ordersys_shopcartinfo
                        WHERE
                            is_delete=false AND shop_cart_id='{shop_cart_id}'
                        """.format(shop_cart_id = shop_cart_id) 
                    )
                    if shopCatrInfoList:
                        shopCatrInfoList = [dict(data) for data in shopCatrInfoList]
                        return json.dumps({'result': 'success', 'data': shopCatrInfoList}, default=str)
                    return json.dumps({'result': 'success', 'data': []}, default=str)
            elif order_id != None:
                # 查看指定order_id下所有訂單資訊
                shopCatrInfoList = get_data_from_pgdb(
                    """
                    SELECT 
                        *
                    FROM 
                        public.ordersys_shopcartinfo
                    WHERE
                        is_delete=false AND order_id='{order_id}'
                    """.format(order_id = order_id) 
                )
                if shopCatrInfoList:
                    shopCatrInfoList = [dict(data) for data in shopCatrInfoList]
                    return json.dumps({'result': 'success', 'data': shopCatrInfoList}, default=str)
                return json.dumps({'result': 'success', 'data': []}, default=str)
            else:
                # 不指定任何參數，回傳最低限度所有order list
                # 用不太到?
                data=OrderSys_ShopCartInfo.objects.filter(is_delete=False).order_by('-created').values(
                    'id',
                    'created',
                    'shop_cart_id',
                    'order_id',
                    'shopper_name',
                    'item_name',
                    'item_number',
                    'item_price',
                    'item_content',
                    'item_index',
                    'pay',
                    'last_modify_date'
                )
                if len(data) > 300:
                    data = data[:300]
                returnList = [data[i] for i in range(len(data))]
                return json.dumps({'result': 'success', 'data':returnList})

        elif request.method == 'DELETE':
            if shop_cart_id != None:
                if item_index != None:
                    write_sql_to_pgdb(
                    """
                        UPDATE public.ordersys_shopcartinfo
                        SET 
                            is_delete=true
                        WHERE shop_cart_id='{shop_cart_id}' AND item_index={item_index};
                    """.format(
                            shop_cart_id = shop_cart_id,
                            item_index = item_index,
                        )
                    )
                    return json.dumps({'result': 'success', 'data':''})
                else:
                    return json.dumps({'result': 'fail', 'data': {'message': '目前不支援，請添加item_index參數'}})
            elif order_id != None:
                return json.dumps({'result': 'fail', 'data': {'message': '目前不支援刪除order_id底下所有訂餐資訊API'}})
            else:
                return json.dumps({'result': 'fail', 'data':{'message': '缺少參數: shop_cart_id'}})
        else:
            return json.dumps({'result': 'fail', 'date': {'message': '不正確的HTTP請求method'}})

    except Exception as e:
        return json.dumps({'result': 'fail', 'data': {'message': str(e)}})

# 公告系統區塊
def Announcement_Manager(id=None):
    try:
        if request.method == 'POST':
            write_sql_to_pgdb(
                """
                    INSERT INTO announcement_list 
                    (who, title, content) 
                    VALUES 
                    ('{who}', '{title}', '{content}')
                """.format(
                    who=request.form.get('who'),
                    title=request.form.get('title'),
                    content=request.form.get('content'),
                )
            )
            return json.dumps({'result': 'success', 'data': {}})
        elif request.method == 'GET':
            if id != None:
                Announcement_data = get_data_from_pgdb(
                    """
                        SELECT *
                        FROM 
                            public.announcement_list
                        WHERE
                            id='{id}'
                    """.format(
                        id=id
                    )
                )
                Announcement_data = [dict(data) for data in Announcement_data][0]
                return json.dumps({'result': 'success', 'data':Announcement_data}, default=str)
            else:
                Announcement_data = get_data_from_pgdb(
                    """
                        SELECT *
                        FROM 
                            public.announcement_list
                        WHERE
                            is_delete=false
                    """.format(
                        id=id
                    )
                )
                if Announcement_data:
                    Announcement_data = [dict(data) for data in Announcement_data]
                    return json.dumps({'result': 'success', 'data':Announcement_data}, default=str)
                return json.dumps({'result': 'success', 'data':[]}, default=str)

        elif request.method == 'DELETE':
            if id != None:
                write_sql_to_pgdb(
                """
                    UPDATE public.announcement_list
                    SET 
                        is_delete=true
                    WHERE id='{id}';
                """.format(
                        id = id,
                    )
                )
                return json.dumps({'result': 'success', 'data':{}})
            else:
                return json.dumps({'result': 'fail', 'date': {'message': '缺少參數 id'}})
        else:
            return json.dumps({'result': 'fail', 'date': {'message': '不正確的HTTP請求method'}})

    except Exception as e:
        return json.dumps({'result': 'fail', 'data': {'message': str(e)}})

def Get_Last_Ten_Announcement_List():
    try:
        if request.method == 'GET':
            Announcement_data = get_data_from_pgdb(
                """
                    SELECT created, title, id
                    FROM 
                        public.announcement_list
                    WHERE
                        is_delete=false
                    LIMIT 10
                """
            )
            if Announcement_data:
                Announcement_data = [dict(data) for data in Announcement_data]
                return json.dumps({'result': 'success', 'data':Announcement_data}, default=str)
            return json.dumps({'result': 'success', 'data':[]}, default=str)
        else:
            return json.dumps({'result': 'fail', 'date': {'message': '不正確的HTTP請求method'}})
    except Exception as e:
        return json.dumps({'result': 'fail', 'date': {'message': str(e)}})

def Update_Announcement():
    if request.method == 'POST':
        try:
            write_sql_to_pgdb(
                """
                UPDATE announcement_list 
                SET 
                    who='{who}',
                    title='{title}',
                    content='{content}',
                    last_modify_date='{last_modify_date}'
                WHERE
                    id='{id}'
                """.format(
                    id=request.form.get('id'),
                    who=request.form.get('who'),
                    title=request.form.get('title'),
                    content=request.form.get('content'),
                    last_modify_date=datetime.datetime.now()
                )
            )
            return json.dumps({'result': 'success', 'data': {}})
        except Exception as e:
            return json.dumps({'result': 'fail', 'data': {'message': str(e)}})
    else:
        return json.dumps({'result': 'fail', 'date': {'message': '不正確的HTTP請求method'}})
