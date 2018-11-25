from flask import Flask, render_template, request, jsonify
import sqlite3
app = Flask(__name__)

conn = sqlite3.connect('/database/main.db')

@app.route('/')
def home():
    # createTable()
    return  render_template('index.html')

@app.route('/save-positions', methods=['POST'])
def savePositions():
    data = request.get_json('obj')
    id = data['id']
    left = data['position']['left']
    top = data ['position']['top']

    if isExisitngBtn(id):
        update(id, left, top)
    else:
        insert(id, left, top)
    return 'Position successfully updated'

@app.route('/get-positions')
def getPositions():
    conn = sqlite3.connect('/database/main.db')
    c = conn.cursor()
    result = c.execute("SELECT * from btnPositions")
    resultList = result.fetchall()
    print(resultList)
    return jsonify(resultList)

# Check if the button has already been inserted into the table
def isExisitngBtn(id):
    conn = sqlite3.connect('/database/main.db')
    c = conn.cursor()
    result = c.execute("SELECT count(*) FROM btnPositions WHERE btnID = :id", {'id': id})
    return result.fetchone()[0]
    conn.commit()
    conn.close()

def insert(id,  left, top ):
    conn = sqlite3.connect('/database/main.db')
    c = conn.cursor()
    c.execute("INSERT INTO btnPositions VALUES (?,?,?)", (id, left, top))
    c.execute("SELECT * from btnPositions")
    print(c.fetchall())
    conn.commit()
    conn.close()

def update(id,  left, top ):
    conn = sqlite3.connect('/database/main.db')
    c = conn.cursor()
    c.execute("""UPDATE btnPositions 
                 SET left = ?,
                     top = ?
                 WHERE btnID = ?""", (left, top, id))
    c.execute("SELECT * from btnPositions")
    print(c.fetchall())
    conn.commit()
    conn.close()

def createTable():
    conn = sqlite3.connect('/database/main.db')
    c = conn.cursor()
    result = c.execute("""CREATE TABLE btnPositions (
                btnID text,
                left real,
                top real
            )""")
    print(result)
    conn.commit()
    conn.close()




if __name__ == '__main__':
    app.run()