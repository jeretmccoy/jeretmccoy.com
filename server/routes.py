from flask import Flask, request, jsonify, Blueprint, send_from_directory
from helpers import *
from models import User, Post, db, PDFs
import bcrypt
from helpers import authenticate
from werkzeug.utils import secure_filename
import os

PDF_UPLOAD_PATH = 'pdfs/'

routes = Blueprint('api_routes', __name__)

@routes.route('/api')
def hello_world():
    return 'Hello, World!'

@routes.route('/api/register', methods=['POST'])
def register():
    data = request.get_json() #eg {'name': 'John Doe', 'email': 'johndoe32@example.com', 'password': 'password123'}

    if not verifyCaptcha(data['recaptchaResponse']):
        return jsonify({"error": "reCAPTCHA verification failed"}), 400

    existing_user = User.query.filter_by(username=data['name']).first() #check if email is already in db and if so return error
    if existing_user:
        return jsonify({'message': 'User with this email already exists!'}), 400
      
    pwd = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()) #security requirement, hashes the password
    new_user = User(username=data['name'], email=data['email'], password=pwd, admin=False) #make sure admin is false on prod
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully!'}), 201

@routes.route('/api/signin', methods=['POST'])
def signin():
    data = request.get_json() #eg {'name': 'John Doe', 'password': 'password123'}
    existing_user = User.query.filter_by(username=data['name']).first() #check if email is already in db and if so return error
    if (existing_user and bcrypt.checkpw(data['password'].encode('utf-8'), existing_user.password)): #if the password is legit log in
        jwtoken = makeJWT(data['name'])
        return jsonify({'message': 'Login successful!', 'token': jwtoken, 'admin': existing_user.admin}), 200
    else:                                                                #if it's not legit, error
        return jsonify({'message': 'Invalid email or password.'}), 401 

@routes.route('/api/newPost', methods=['POST'])
def add_post():
    data = request.get_json()
    user, authError = authenticate(data, reqAdmin=True)
    if authError:
        return authError
    content = request.json.get('content')
    description = request.json.get('description')
    title = request.json.get('title')
    post = Post(title=title, description=description, content=content, author=user.username)
    db.session.add(post)
    db.session.commit()
    return jsonify({"message": "Post added"}), 201


@routes.route('/api/getPosts', methods=['GET'])
def get_posts():
    # Order the posts by date_created in ascending order
    posts = Post.query.order_by(Post.dateMade.desc()).all()

    response = []
    for post in posts:
        formatted_date = post.dateMade.strftime("%B %d, %Y")
        response.append({
            "id": post.id,
            "title": post.title,
            "description": post.description,
            "date": formatted_date
        })
    return jsonify(response)

@routes.route('/api/post/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({'message': 'Post not found'}), 404
    return jsonify({'id': post.id, 'title': post.title, 'description': post.description, 'content': post.content})

@routes.route('/api/uploadPDF', methods=['POST'])
def upload_pdf():
    post_id = request.form['postId']
    if 'pdf' not in request.files:
        return jsonify(error='No PDF file'), 400
    data = {'token': request.form['token']}
    user, authError = authenticate(data, reqAdmin=True)
    if authError:
        return authError

    file = request.files['pdf']

    if file.filename == '':
        return jsonify(error='No selected file'), 400

    if file:
        # Check if PDF entry already exists for this post ID
        existing_pdf = PDFs.query.filter_by(post_id=post_id).first()
        if existing_pdf:
            try:
                os.remove(existing_pdf.file_path)  # delete the old file
                db.session.delete(existing_pdf)    # delete the old record
            except Exception as e:
                return jsonify(error='File not found'), 404
                # Handle error. Decide if you want to return or proceed with the upload

        filename = secure_filename(file.filename)
        filepath = os.path.join(PDF_UPLOAD_PATH, filename)
        file.save(filepath)

        # Store the new file reference in your PDFs model
        pdf_record = PDFs(post_id=post_id, file_path=filepath)
        db.session.add(pdf_record)
        db.session.commit()

        # Return the URL to download the file
        return jsonify(url='/api/downloadPDF/' + str(pdf_record.id))

    return jsonify(error='File upload error'), 500


@routes.route('/api/checkPDF/<int:post_id>', methods=['GET'])
def check_pdf(post_id):
    pdf = PDFs.query.filter_by(post_id=post_id).first()
    if pdf is not None:
        return jsonify({'message': 'PDF exists'}), 201
    return jsonify({'message': 'File does not exist'}), 404

@routes.route('/api/downloadPDF/<int:post_id>', methods=['GET'])
def download_pdf(post_id):
    pdf_record = PDFs.query.filter_by(post_id=post_id).first()
    if pdf_record:
        return send_from_directory('', pdf_record.file_path)
    return jsonify(error='File not found'), 404

@routes.route('/api/deletePost', methods=['POST'])
def delete_post():

    data = request.get_json()
    user, authError = authenticate(data, reqAdmin=True)
    if authError:
        return authError

    post = Post.query.get_or_404(data['postID'])
    
    # Delete associated PDFs
    pdfs = PDFs.query.filter_by(post_id=data['postID']).all()
    for pdf in pdfs:
        db.session.delete(pdf)
        os.remove(pdf.file_path)
    
    db.session.delete(post)
    db.session.commit()
    
    return jsonify({"message": "Post and its PDFs deleted successfully"}), 200

@routes.route('/api/updatePost', methods=['POST'])
def update_post():
    data = request.get_json()
    user, authError = authenticate(data, reqAdmin=True)
    if authError:
        return authError
    post = Post.query.get(data['postId'])
    if not post:
        return jsonify({"error": "Post not found"}), 404
    
    post.title = data['title']
    post.description = data['description']
    post.content = data['content']

    db.session.commit()

    return jsonify({"message": "Post updated successfully"})