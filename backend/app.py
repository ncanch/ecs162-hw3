from flask import Flask, jsonify, send_from_directory, session, request, render_template, redirect, url_for
import os
from flask_cors import CORS
from pymongo import MongoClient
import requests
import bcrypt

static_path = os.getenv('STATIC_PATH','static')
template_path = os.getenv('TEMPLATE_PATH','templates')
# Mongo connection
mongo_uri = os.getenv("MONGO_URI")
mongo = MongoClient(mongo_uri)
##I COMMENTED THIS OUT SO IT WOULD RUN
##db = mongo.get_default_database()


app = Flask(__name__, static_folder=static_path, template_folder=template_path)
CORS(app)

@app.route('/api/key')
def get_key():
    return jsonify({'apiKey': os.getenv('NYT_API_KEY')})

@app.route('/hello/world')
def get_hello_world():
    return "Hello!!"

@app.route('/getArticles')
def get_article():
    try:
        response = requests.get(f'https://api.nytimes.com/svc/search/v2/articlesearch.json?q="Sacramento" or "Davis"&api-key={api_key}')
        data = response.json()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/')
@app.route('/<path:path>')
def serve_frontend(path=''):
    if path != '' and os.path.exists(os.path.join(static_path,path)):
        return send_from_directory(static_path, path)
    return send_from_directory(template_path, 'index.html')

##if logged in already go directly to the home page
##@app.route('/')
##def home():
##    if 'username' in session:
##        return "Welcome" + session['username']
    
@app.route('/login', methods=['POST'])
def login():
    users = mongo.db.users
    exists = users.find_one({'name': request.form['username']})
    ##username correct
    if exists:
        ##password correct
        if bcrypt.hashpw(request.form['password'].encode('utf-8'), exists['password']) == exists['password'].encode('utf-8'):
            session['username'] = request.form['username']
            return redirect(url_for('index'))
        return 'Password is incorrect'
    return 'Username is incorrect'

@app.route('/createaccount', methods=['POST', 'GET'])
def createAccount():
    if request.method == 'POST':
        users = mongo.db.users
        ##looks for username and password in the database
        exists = users.find_one({'name' : request.form['username']})
        if exists is None:
            ##take the password input from the form and generate hash version to store
            hashPassword = bcrypt.hashpw(request.form['password'].encode('utf-8'), bcrypt.gensalt())
            users.insert({'name' : request.form['username'], 'password' : hashPassword})
            session['username'] = request.form['username']
            ##redirect to home page
            return redirect(url_for('index'))
        return 'Username already exists'
    return render_template('createaccount.html')

@app.route("/test-mongo")
def test_mongo():
    return jsonify({"collections": db.list_collection_names()})

if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8000)),debug=debug_mode)