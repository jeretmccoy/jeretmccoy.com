from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import bcrypt
import jwt
import datetime
import requests

app = Flask(__name__)

CORS(app, resources={r"/*": {
    "origins": "http://localhost:3000",
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///my_database.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'Give me a job!'
app.config['JWT_EXP_DELTA_SECONDS'] = 60 * 60 * 24
db = SQLAlchemy(app)




class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    email = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(150), nullable=False)

# Create the initial database
with app.app_context():
    db.create_all()


def verifyCaptcha(captcha):
    recaptchaSecret = '6LcsrCooAAAAAE29c5ijf048dVNGn7xFx9SHXL-o'
    if not captcha:
        return False
    verification_response = requests.post(
        'https://www.google.com/recaptcha/api/siteverify',
        data={
            'secret': recaptchaSecret,
            'response': captcha,
        }
    )
    verification_result = verification_response.json()
    if not verification_result.get('success'):
        return False
    return True



def makeJWT(name):
    return jwt.encode(
        {
            'name': name,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=app.config['JWT_EXP_DELTA_SECONDS'])
        }, 
        app.config['SECRET_KEY'], 
        algorithm='HS256')

def decodeJWT(token):
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


@app.route('/api')
def hello_world():
    return 'Hello, World!'

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json() #eg {'name': 'John Doe', 'email': 'johndoe32@example.com', 'password': 'password123'}
    #print(data, flush=True)

    if not verifyCaptcha(data['recaptchaResponse']):
        return jsonify({"error": "reCAPTCHA verification failed"}), 400

    existing_user = User.query.filter_by(username=data['name']).first() #check if email is already in db and if so return error
    if existing_user:
        return jsonify({'message': 'User with this email already exists!'}), 400
      
    pwd = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()) #security requirement, hashes the password
    new_user = User(username=data['name'], email=data['email'], password=pwd)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully!'}), 201

@app.route('/api/signin', methods=['POST'])
def signin():
    data = request.get_json() #eg {'name': 'John Doe', 'password': 'password123'}
    print(data, flush=True)
    existing_user = User.query.filter_by(username=data['name']).first() #check if email is already in db and if so return error
    if (existing_user and bcrypt.checkpw(data['password'].encode('utf-8'), existing_user.password)): #if the password is legit log in
        jwtoken = makeJWT(data['name'])
        return jsonify({'message': 'Login successful!', 'token': jwtoken}), 200
    else:                                                                #if it's not legit, error
        return jsonify({'message': 'Invalid email or password.'}), 401 





if __name__ == '__main__':
    app.run()
