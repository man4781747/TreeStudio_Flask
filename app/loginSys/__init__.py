from flask import Flask
from . import route

def load_app(flask_app):
    flask_app.add_url_rule('/loginPage', 'loginPage', route.loginPage, methods=['GET'])
    
    flask_app.add_url_rule('/loginKeyGet', 'loginKeyGet', route.getPublickey, methods=['GET'])
    
    flask_app.add_url_rule('/login', 'login', route.GetLoginInfo, methods=['POST'])
    
    flask_app.add_url_rule('/checkLoginInfo', 'checkLoginInfo', route.checkLoginInfo, methods=['GET'])
    

    return flask_app
