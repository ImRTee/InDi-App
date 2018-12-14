import sqlite3
from flask import jsonify


class Database():
    mainDataBasePath = "../storage/main.db"
    def __init__(self):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        result = c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='PopoverBtn' OR name='Page' ")
        tableList = result.fetchall()
        conn.commit()
        conn.close()
        if  len(tableList) == 0:     #if there is no table exists
            self.createPopoverBtnTable()
            self.createPageTable()
            # self.insertDefaultImagePath()


    def insertButton(self, btnId, content, left, top, width, height, pageId):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("INSERT INTO PopoverBtn  VALUES (?,?,?,?,?,?,?)", (btnId, content, left, top, width, height, pageId))
        conn.commit()
        conn.close()

    def insertPage(self, pageId, projectName, teamName, confluenceLink, imagePath):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("INSERT INTO page VALUES (?,?,?,?,?)", (pageId, projectName, teamName, confluenceLink, imagePath))
        conn.commit()
        conn.close()

    def deletePage(self, pageId):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("DELETE FROM Page WHERE  pageId = ?", (pageId, ))
        c.execute("DELETE FROM PopoverBtn WHERE  pageId = ?", (pageId, ))
        conn.commit()
        conn.close()


    def updateContent(self, originId, newId, newContent):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""UPDATE PopoverBtn 
                     SET btnId = ?,
                           content = ?
                     WHERE btnId = ? """, (newId, newContent, originId))
        conn.commit()
        conn.close()


    def updatePos(self, btnId,  left, top):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""UPDATE PopoverBtn  
                     SET left = ?,
                           top = ?
                     WHERE btnId = ? """, (left, top, btnId))
        conn.commit()
        conn.close()

    def updateSize(self, btnId,  width, height):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""UPDATE PopoverBtn  
                     SET width = ?,
                           height = ?
                     WHERE btnId = ? """, (width, height, btnId))
        conn.commit()
        conn.close()

    def  updateImgPath(self, path, pageId):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""UPDATE Page
                  SET  imagePath =  ?
                   WHERE pageId =?""", (path, pageId))
        print(c.fetchall())
        conn.commit()
        conn.close()

    def createPageTable(self):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""CREATE TABLE Page (
                    pageId text NOT NULL UNIQUE, 
                    projectName text,
                    teamName text, 
                    confluenceLink text,
                    imagePath text
                )""")
        print("Page Table Created")

    def createPopoverBtnTable(self):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""CREATE TABLE PopoverBtn (
                    btnId text NOT NULL UNIQUE, 
                    content text ,
                    left real,
                    top real,
                    width integer,
                    height integer,
                    pageId text
                )""")
        print("PopoverBtn Table Created")


    def deleteBtn(self, id):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("DELETE FROM PopoverBtn WHERE  btnId = ?", (id, ))
        conn.commit()
        conn.close()











