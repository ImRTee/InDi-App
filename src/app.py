from flask import Flask, render_template, request, jsonify
from src.database.database import  Database
import sqlite3
app = Flask(__name__)

db = Database()

@app.route('/')
def home():
    print('Awesome')
    return  render_template('index.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

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

@app.route('/get-positions')
def getPositions():
    conn = sqlite3.connect(db.mainDataBasePath)
    c = conn.cursor()
    result = c.execute("SELECT * from btnPositions")
    resultList = result.fetchall()
    return jsonify(resultList)

# Check if the button has already been inserted into the table
def isExisitngBtn(id):
    conn = sqlite3.connect(db.mainDataBasePath)
    c = conn.cursor()
    result = c.execute("SELECT count(*) FROM btnPositions WHERE btnID = :id", {'id': id})
    isExist = result.fetchone()[0]
    conn.commit()
    conn.close()
    return  isExist


if __name__ == '__main__':
    app.run()