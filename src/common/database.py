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
            self.createTeamTable()
            # self.insertDefaultImagePath()

    def insertButton(self, btnId, content, left, top, width, height, pageId, teamId):
        try:
            conn = sqlite3.connect(self.mainDataBasePath)
            c = conn.cursor()
            c.execute("INSERT INTO PopoverBtn  VALUES (?,?,?,?,?,?,?,?)", (btnId, content, left, top, width, height, pageId, teamId))
            conn.commit()
        except sqlite3.Error as e:
            if 'UNIQUE' in e.args[0]:
                conn.close()
                return 'existed'
        conn.close()
        return 'successful'

    def insertPage(self, pageId, projectName,  projectDescription, pageLink, teamId, imagePath):
        try:
            conn = sqlite3.connect(self.mainDataBasePath)
            c = conn.cursor()
            c.execute("INSERT INTO Page VALUES (?,?,?, ?,?,?)", (pageId, projectName, projectDescription, pageLink, teamId, imagePath))
            conn.commit()
        except sqlite3.Error as e:
            if 'UNIQUE' in e.args[0]:
                conn.close()
                return  'existed'
        conn.close()
        return 'successful'

    def insertTeam(self, teamId, confluenceLink, imagePath):
        try:
            conn = sqlite3.connect(self.mainDataBasePath)
            c = conn.cursor()
            c.execute("INSERT INTO Team VALUES (?,?, ?)", (teamId, confluenceLink, imagePath))
            conn.commit()
        except sqlite3.Error as e:
            if 'UNIQUE' in  e.args[0]:
                conn.close()
                return 'existed'
        conn.close()
        return 'successful'

    def deleteTeam(self,  teamId):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("DELETE FROM Team WHERE  teamId = ? ", (teamId, ))
        c.execute("DELETE FROM Page WHERE  teamId = ?", (teamId, ))
        conn.commit()
        conn.close()

    def deletePage(self, pageId, teamId):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("DELETE FROM Page WHERE  pageId = ? and teamId = ? ", (pageId, teamId))
        c.execute("DELETE FROM PopoverBtn WHERE  pageId = ? and teamId = ?", (pageId, teamId ))
        conn.commit()
        conn.close()

    def updateContent(self, originId, newId, newContent, pageId, teamId):
        try:
            conn = sqlite3.connect(self.mainDataBasePath)
            c = conn.cursor()
            c.execute("""UPDATE PopoverBtn 
                     SET btnId = ?,
                           content = ?
                     WHERE btnId = ?  and pageId = ? and teamId = ?""", (newId, newContent, originId, pageId, teamId))
            conn.commit()
        except sqlite3.Error as e:
            if 'UNIQUE' in e.args[0]:
                conn.close()
                return  'existed'
        conn.close()
        return 'successful'

    def updatePos(self, btnId,  left, top, pageId, teamId):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""UPDATE PopoverBtn  
                     SET left = ?,
                           top = ?
                     WHERE btnId = ? and pageId = ? and teamId = ? """, (left, top, btnId, pageId, teamId))
        conn.commit()
        conn.close()

    def updateSize(self, btnId,  width, height, pageId, teamId):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""UPDATE PopoverBtn  
                     SET width = ?,
                           height = ?
                     WHERE btnId = ? and pageId = ? and teamId = ?""", (width, height, btnId, pageId, teamId))
        conn.commit()
        conn.close()

    def  updateDiagramImgPath(self, path, teamId, pageId):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""UPDATE Page
                  SET  imagePath =  ?
                   WHERE pageId =? and teamId = ?""", (path, pageId, teamId))
        print(c.fetchall())
        conn.commit()
        conn.close()


    def  updateTeamImgPath(self, path, teamId):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""UPDATE Team
                  SET  imagePath =  ?
                   WHERE teamId = ?""", (path, teamId))
        print(c.fetchall())
        conn.commit()
        conn.close()


    def createPageTable(self):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""CREATE TABLE Page (
                    pageId text NOT NULL, 
                    projectName text NOT NULL,
                    projectDescription text NOT NULL,
                    pageLink text NOT NULL,
                    teamId text NOT NULL, 
                    imagePath text NOT NULL,
                    PRIMARY KEY(`pageId`, `teamId` )
                )""")
        print("Page Table Created")

    def createPopoverBtnTable(self):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""CREATE TABLE PopoverBtn (
                    btnId text NOT NULL,  
                    content text ,
                    left real,
                    top real,
                    width integer,
                    height integer,
                    pageId text,
                    teamId text,
                    PRIMARY KEY(`btnId`,`pageId`,`teamId`)
                )""")
        print("PopoverBtn Table Created")

    def createTeamTable(self):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("""CREATE TABLE Team (
                    teamId text NOT NULL, 
                    confluenceLink text NOT NULL,
                    imagePath text NOT NULL,
                    PRIMARY KEY(`teamId`)
                )""")
        print("Team Table Created")

    def deleteBtn(self, btnId, pageId, teamId):
        conn = sqlite3.connect(self.mainDataBasePath)
        c = conn.cursor()
        c.execute("DELETE FROM PopoverBtn WHERE  btnId = ? and pageId = ? and teamId = ?", (btnId, pageId, teamId))
        conn.commit()
        conn.close()









