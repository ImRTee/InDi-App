import sqlite3
from flask import jsonify


class Database():
    mainDataBasePath = "../storage/main.db"
    def __init__(self):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        result = c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='PopoverBtn' ")
        tableList = result.fetchall()
        conn.commit()
        conn.close()
        if  len(tableList) == 0:     #if there is no table exists
            self.createPopoverBtnTable()
            self.insertDefaultImagePath()


    # def getPositions(self):
    #     conn = sqlite3.connect(self.mainDataBasePath)
    #     c = conn.cursor()
    #     result = c.execute("SELECT * from PopoverBtn ")
    #     resultList = result.fetchall()
    #     return jsonify(resultList)

    # def insertPos(self, id,  left, top):
    #     conn = sqlite3.connect(self.mainDataBasePath)
    #     c = conn.cursor()
    #     c.execute("INSERT INTO PopoverBtn VALUES (?,?, ?,?)", (id, left, top))
    #     conn.commit()
    #     conn.close()

    def insertContent(self, id, content):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("INSERT INTO PopoverBtn  VALUES (?,?,?,?,?,?)", (id, content, 100, 0, 40, 40))
        conn.commit()
        conn.close()

    def updateContent(self, originId, newId, newContent):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""UPDATE PopoverBtn 
                     SET id = ?,
                           content = ?
                     WHERE id = ? """, (newId, newContent, originId))
        conn.commit()
        conn.close()


    def updatePos(self, id,  left, top):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""UPDATE PopoverBtn  
                     SET left = ?,
                           top = ?
                     WHERE id = ? """, (left, top, id))
        conn.commit()
        conn.close()

    def updateSize(self, id,  width, height):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""UPDATE PopoverBtn  
                     SET width = ?,
                           height = ?
                     WHERE id = ? """, (width, height, id))
        conn.commit()
        conn.close()

    def  updateImgPath(self, path):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""UPDATE PopoverBtn 
                  SET  content =  ?
                   WHERE id =?""", (path, 'image') )
        print(c.fetchall())
        conn.commit()
        conn.close()


    def createPopoverBtnTable(self):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""CREATE TABLE PopoverBtn (
                    id text,
                    content text ,
                    left real,
                    top real,
                    width integer,
                    height integer 
                )""")
        print("PopoverBtn Table Created")

    def insertDefaultImagePath(self):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("INSERT INTO PopoverBtn  VALUES (?,?,?,?,?,?)", ('image', 'empty', '','','',''))
        conn.commit()
        conn.close()
        print('Default image path inserted')

    def deleteBtn(self, id):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("DELETE FROM PopoverBtn WHERE  id = ?", (id, ))
        conn.commit()
        conn.close()











