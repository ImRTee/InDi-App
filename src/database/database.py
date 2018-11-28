import sqlite3
from flask import jsonify


class Database():
    print('Yooooo')
    mainDataBasePath = "database/main.db"

    def __init__(self):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        result = c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='btnPositions' OR name ='contents' ")
        tableList = result.fetchall()
        if  len(tableList) == 0:     #if there is no table exists
            self.createBtnPositionsTable()
            self.createContentTable()
            self.insertDefaultImagePath()

        conn.commit()
        conn.close()

    def getPositions(self):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        result = c.execute("SELECT * from btnPositions")
        resultList = result.fetchall()
        return jsonify(resultList)

    def insertPos(self, id,  left, top):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("INSERT INTO btnPositions VALUES (?,?,?)", (id, left, top))
        conn.commit()
        conn.close()

    def updatePos(self, id,  left, top):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""UPDATE btnPositions 
                     SET left = ?,
                           top = ?
                     WHERE btnID = ? """, (left, top, id))

        c.execute("SELECT * from btnPositions")
        conn.commit()
        conn.close()

    def  updateImgPath(self, path):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""UPDATE contents 
                  SET  content =  ?
                   WHERE btnID =?""", (path, 'image') )
        print(c.fetchall())
        conn.commit()
        conn.close()


    def createBtnPositionsTable(self):
            conn = sqlite3.connect(self.mainDataBasePath)
            c = conn.cursor()
            c.execute("""CREATE TABLE btnPositions (
                        btnID text,
                        left real,
                        top real
                    )""")
            print("BtnPositions Table Created")

    def createContentTable(self):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""CREATE TABLE contents (
                    btnID text,
                    content text
                )""")
        print("Content Table Created")

    def insertDefaultImagePath(self):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("INSERT INTO contents VALUES (?,?)", ('image', 'empty'))
        conn.commit()
        conn.close()
        print('Default image path inserted')










