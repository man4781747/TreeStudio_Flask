from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask import render_template
import json
import datetime

import app.loginSys as loginSys
import app.TreeStudio as loginTS

app = Flask(__name__,static_url_path='/static', static_folder='/home/coder/project/TreeStudio_Flask/static')

loginSys.load_app(app)
loginTS.load_app(app)


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=9000)