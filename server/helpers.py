from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import bcrypt
import jwt
import datetime
import requests
from models import User, db

SECRET_KEY = 'Change on Production!!!!!'
JWT_EXP_DELTA_SECONDS = 60 * 60 * 24

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
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=JWT_EXP_DELTA_SECONDS)
        }, 
        SECRET_KEY, 
        algorithm='HS256')

def decodeJWT(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def _process_token(data):
    token = data['token']
    payload = decodeJWT(token)  # verify the account for security
    if payload is None:
        return None, None
    username = payload['name']
    user = User.query.filter_by(username=username).first()  # get the user who made the verified request
    return payload, user


def authenticate(data, reqAdmin=False):
    payload, user = _process_token(data)

    if payload is None:
        return None, (jsonify({'message': 'Invalid or expired token.'}), 401)

    elif not user:
        return None, (jsonify({'message': 'User not found.'}), 401)

    elif reqAdmin and not user.admin:
        return None, (jsonify({'message': 'User not admin.'}), 403)

    else:
        return user, None