import  sys
import os
from flask import Flask, render_template, request, jsonify, flash, send_from_directory
from common.database import Database
import sqlite3
from werkzeug.utils import secure_filename, redirect

# Upload folder: where you want to store upload images, use relative path in production server
UPLOAD_FOLDER = 'static/images'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
db = Database()

#print('********PYTHONPATH*********')
#for p in sys.path:
#    print(p)
#print('******************************')


@app.route('/')
def home():
    return  render_template('index.html')

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

@app.route('/updateContent-position', methods=['POST'])
def updatePosition():
    data = request.get_json('obj')
    id = data['id']
    left = data['position']['left']
    top = data ['position']['top']
    db.updatePos(id, left, top)
    return 'Position successfully updated'

@app.route('/updateContent-size', methods=['POST'])
def updateSize():
    data = request.get_json('sizeObj')
    print(data)
    id = data['id']
    width = data['size']['width']
    height = data['size']['height']
    db.updateSize(id, width, height)
    return 'Size successfully updated'


@app.route('/add-button', methods=['POST'])
def addButton():
    data = request.get_json('obj')
    id = data['id']
    content = data['content']
    left = data['left']
    top = data['top']
    width = data['width']
    height = data['height']
    db.insertButton(id, content, left, top, width, height)
    return ''

@app.route('/updateContent-content', methods=['POST'])
def updateContent():
    data = request.get_json('newContentObj')
    originId = data['originId']
    newId = data['newId']
    newContent = data['newContent']
    db.updateContent(originId, newId, newContent)
    return ''


# @app.route('/get-positions')
# def getPositions():
#     conn = sqlite3.connect(db.mainDataBasePath)
#     c = conn.cursor()
#     result = c.execute("SELECT * from PopoverBtn")
#     resultList = result.fetchall()
#     return jsonify(resultList)

@app.route('/get-image')
def getImagePath():
    conn = sqlite3.connect(db.mainDataBasePath)
    c = conn.cursor()
    c.execute("SELECT  content  from PopoverBtn WHERE id='image'")
    result = c.fetchall()
    return jsonify(result)

@app.route('/get-popover-buttons')
def getContents():
    conn = sqlite3.connect(db.mainDataBasePath)
    c = conn.cursor()
    c.execute("SELECT  *  from PopoverBtn WHERE id NOT IN ('image')") #Get all content not image
    result = c.fetchall()
    return jsonify(result)

@app.route('/delete-button', methods=['POST'])
def deleteBtn():
    id = request.get_json('id')
    db.deleteBtn(id)
    return ''


# # Check if the button has already been inserted into the table
# def isExisitngBtn(id):
#     conn = sqlite3.connect(db.mainDataBasePath)
#     c = conn.cursor()
#     result = c.execute("SELECT count(*) FROM PopoverBtn WHERE id = :id", {'id': id})
#     isExist = result.fetchone()[0]
#     conn.commit()
#     conn.close()
#     return  isExist

# Source: http://flask.pocoo.org/docs/0.12/patterns/fileuploads/
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

if __name__ == '__main__':
    app.run(debug=True)