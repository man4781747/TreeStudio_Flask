from flask import Flask
from . import route


def load_app(flask_app):
    flask_app.add_url_rule('/', 'treetudio_home', route.home, methods=['GET'])
    
    # 公告系統
    flask_app.add_url_rule('/TreeStudioAPIs/Announcement_Manager/<id>/', 'Announcement_Manager', route.Announcement_Manager, methods=["GET","POST","DELETE"])
    flask_app.add_url_rule('/TreeStudioAPIs/Announcement_Manager/', 'Announcement_Manager', route.Announcement_Manager, methods=["GET","POST","DELETE"])
    flask_app.add_url_rule('/TreeStudioAPIs/Get_Last_Ten_Announcement_List/', 'Get_Last_Ten_Announcement_List', route.Get_Last_Ten_Announcement_List, methods=["GET"])
    flask_app.add_url_rule('/TreeStudioAPIs/Update_Announcement/', 'Update_Announcement', route.Update_Announcement, methods=["POST"])
    
    # 點餐系統
    flask_app.add_url_rule('/TreeStudioAPIs/OrderSys_ShopInfo_Manager/<shop_id>/', 'OrderSys_ShopInfo_Manager', route.OrderSys_ShopInfo_Manager, methods=["GET","POST","DELETE"])
    flask_app.add_url_rule('/TreeStudioAPIs/OrderSys_ShopInfo_Manager/', 'OrderSys_ShopInfo_Manager', route.OrderSys_ShopInfo_Manager, methods=["GET","POST","DELETE"])
    
    flask_app.add_url_rule('/TreeStudioAPIs/OrderSys_OrderInfo_Manager/shop_cart_id/<shop_cart_id>/<item_index>/', 'OrderSys_OrderInfo_Manager', route.OrderSys_OrderInfo_Manager, methods=["GET","POST","DELETE"])
    flask_app.add_url_rule('/TreeStudioAPIs/OrderSys_OrderInfo_Manager/shop_cart_id/<shop_cart_id>/', 'OrderSys_OrderInfo_Manager', route.OrderSys_OrderInfo_Manager, methods=["GET","POST","DELETE"])
    flask_app.add_url_rule('/TreeStudioAPIs/OrderSys_OrderInfo_Manager/order_id/<order_id>/', 'OrderSys_OrderInfo_Manager', route.OrderSys_OrderInfo_Manager, methods=["GET","POST","DELETE"])
    flask_app.add_url_rule('/TreeStudioAPIs/OrderSys_OrderInfo_Manager/close_order/<order_id>/<set_value>/', 'OrderSys_OrderInfo_Manager', route.OrderSys_OrderInfo_Manager, methods=["GET","POST","DELETE"])
    flask_app.add_url_rule('/TreeStudioAPIs/OrderSys_OrderInfo_Manager/', 'OrderSys_OrderInfo_Manager', route.OrderSys_OrderInfo_Manager, methods=["GET","POST","DELETE"])
    
    flask_app.add_url_rule('/TreeStudioAPIs/Get_Today_OrderInfo/', 'Get_Today_OrderInfo', route.Get_Today_OrderInfo, methods=["GET"])
    
    flask_app.add_url_rule('/TreeStudioAPIs/Get_OrderInfo_By_Time_Range/', 'Get_OrderInfo_By_Time_Range', route.Get_OrderInfo_By_Time_Range, methods=["GET"])
    flask_app.add_url_rule('/TreeStudioAPIs/Get_OrderInfo_By_Time_Range/<time_range>/', 'Get_OrderInfo_By_Time_Range', route.Get_OrderInfo_By_Time_Range, methods=["GET"])
    
    flask_app.add_url_rule('/TreeStudioAPIs/OrderSys_ShopCart_Manager/order_id/<order_id>/', 'OrderSys_ShopCart_Manager', route.OrderSys_ShopCart_Manager, methods=["GET", "POST"])
    flask_app.add_url_rule('/TreeStudioAPIs/OrderSys_ShopCart_Manager/shop_cart_id/<shop_cart_id>/', 'OrderSys_ShopCart_Manager', route.OrderSys_ShopCart_Manager, methods=["GET", "POST"])
    flask_app.add_url_rule('/TreeStudioAPIs/OrderSys_ShopCart_Manager/shop_cart_id/<shop_cart_id>/<item_index>/', 'OrderSys_ShopCart_Manager', route.OrderSys_ShopCart_Manager, methods=["GET", "POST", "DELETE"])
    
    flask_app.add_url_rule('/TreeStudioAPIs/Get_Wiki_Recent_Change/', 'WikiAPI', route.Get_Wiki_Recent_Change, methods=["GET])
    
    return flask_app