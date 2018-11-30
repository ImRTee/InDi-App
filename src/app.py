import os
from flask import Flask, render_template, request, jsonify, flash, url_for, send_from_directory
from src.database.database import Database
import sqlite3
from werkzeug.utils import secure_filename, redirect

UPLOAD_FOLDER = 'static/images'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
db = Database()

@app.route('/')
def home():
    return  render_template('index.html')

# Source: http://flask.pocoo.org/docs/0.12/patterns/fileuploads/
def allowed_file(filename):
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Source: https://stackoverflow.com/questions/44926465/upload-image-in-flask
@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect('No file part')
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            flash('No selected file')
            return 'Sorry, please select a file to upload'
        if not allowed_file(file.filename):
            flash('No selected file')
            return 'Incorrect file type. Please only upload .png, .jpg and .jpeg files'
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            # Update image path in the database
            db.updateImgPath('../static/images/' + filename)
            return  redirect('/')
    return  ''

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)

@app.route('/save-positions', methods=['POST'])
def savePositions():
    data = request.get_json('obj')
    id = data['id']
    left = data['position']['left']
    top = data ['position']['top']

    if isExisitngBtn(id):
        db.updatePos(id, left, top)
    else:
        db.insertPos(id, left, top)
    return 'Position successfully updated'

@app.route('/save-content', methods=['POST'])
def saveContent():
    data = request.get_json('obj')
    id = data['id']
    content = data['content']
    db.insertContent(id, content)
    return ''


@app.route('/get-positions')
def getPositions():
    conn = sqlite3.connect(db.mainDataBasePath)
    c = conn.cursor()
    result = c.execute("SELECT * from btnPositions")
    resultList = result.fetchall()
    return jsonify(resultList)

@app.route('/get-image')
def getImagePath():
    conn = sqlite3.connect(db.mainDataBasePath)
    c = conn.cursor()
    c.execute("SELECT  content  from contents WHERE id='image'")
    result = c.fetchall()
    return jsonify(result)

@app.route('/get-contents')
def getContents():
    conn = sqlite3.connect(db.mainDataBasePath)
    c = conn.cursor()
    c.execute("SELECT  *  from contents WHERE id NOT IN ('image')") #Get all content not image
    result = c.fetchall()
    return jsonify(result)


# Check if the button has already been inserted into the table
def isExisitngBtn(id):
    conn = sqlite3.connect(db.mainDataBasePath)
    c = conn.cursor()
    result = c.execute("SELECT count(*) FROM btnPositions WHERE id = :id", {'id': id})
    isExist = result.fetchone()[0]
    conn.commit()
    conn.close()
    return  isExist

if __name__ == '__main__':
    app.run(debug=True)