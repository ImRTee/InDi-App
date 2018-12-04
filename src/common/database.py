import sqlite3
from flask import jsonify


class Database():
    mainDataBasePath = "../storage/main.db"
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

    def insertContent(self, id, content):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("INSERT INTO contents VALUES (?,?)", (id, content))
        conn.commit()
        conn.close()

    def updatePos(self, id,  left, top):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""UPDATE btnPositions 
                     SET left = ?,
                           top = ?
                     WHERE id = ? """, (left, top, id))

        c.execute("SELECT * from btnPositions")
        conn.commit()
        conn.close()

    def  updateImgPath(self, path):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""UPDATE contents 
                  SET  content =  ?
                   WHERE id =?""", (path, 'image') )
        print(c.fetchall())
        conn.commit()
        conn.close()


    def createBtnPositionsTable(self):
            conn = sqlite3.connect(self.mainDataBasePath)
            c = conn.cursor()
            c.execute("""CREATE TABLE btnPositions (
                        id text,
                        left real,
                        top real
                    )""")
            print("BtnPositions Table Created")

    def createContentTable(self):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""CREATE TABLE contents (
                    id text,
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









