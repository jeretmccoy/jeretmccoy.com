from flask import Flask
from flask_cors import CORS
from models import db
from routes import routes

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///my_database.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.register_blueprint(routes)

db.init_app(app)





# Create the initial database
with app.app_context():
    db.create_all()


if __name__ == '__main__':
    app.run()
