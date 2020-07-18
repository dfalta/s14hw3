from dotenv import load_dotenv
from flask import Flask, render_template, jsonify
from models.homeworkuser import Db, HomeworkUser
from os import environ

load_dotenv('.env')

app = Flask(__name__)

# Local DB connection
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:s14a-key@localhost:5432/homework_users_db'

# Heroku DB connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://htrinqiwxzxzij:17ca73852da0ac67af02db7cfa91194ab8395f093febfc8031c13ea9608a25eb@ec2-34-239-241-25.compute-1.amazonaws.com:5432/d12ferep4s5v81'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = environ.get('SECRET_KEY')
Db.init_app(app)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/load_data', methods=['GET'])
def load_data():
    users_json = {'users': []}
    users = HomeworkUser.query.all()
    for user in users:
        user_info = user.__dict__
        del user_info['_sa_instance_state']
        users_json['users'].append(user_info)
    return jsonify(users_json)
