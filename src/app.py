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
    teams = getTeamsandPages()
    return  render_template('index.html', teams = teams )


@app.route('/<string:teamId>')
def displayTeam(teamId):
    #Get this for sidebar
    teams = getTeamsandPages()
    teamDetails = getTeamDetails(teamId)
    return render_template('team.html', teamDetails=teamDetails, teams=teams)

@app.route('/<string:teamId>/<string:pageId>')
def displayPage(pageId, teamId):
    conn = sqlite3.connect(db.mainDataBasePath)
    c = conn.cursor()
    c.execute("""SELECT  *
                                    FROM Page 
                                    WHERE pageId = ? and teamId = ?""", (pageId, teamId))
    results = c.fetchall()
    pageData = {
        'pageId': results[0][0],
        'projectName': results[0][1],
        'projectDescription': results[0][2],
        'pageLink': results[0][3],
        'teamId': results[0][4],
        'imagePath': results[0][5]
    }
    teams = getTeamsandPages()
    teamDetails = getTeamDetails(teamId);
    return  render_template('page.html', teams=teams, pageData=pageData, teamDetails=teamDetails)

@app.route('/get-pageTable', methods=['GET'])
def getPageTable():
    conn = sqlite3.connect(db.mainDataBasePath)
    c = conn.cursor()
    c.execute("""SELECT  *  
                            from Page 
                            """)
    result = c.fetchall()
    return jsonify(result)

@app.route('/get-teams', methods=['GET'])
def getTeams():
    conn = sqlite3.connect(db.mainDataBasePath)
    c = conn.cursor()
    c.execute("""SELECT  *  
                            from Team 
                            """)
    result = c.fetchall()
    return jsonify(result)

@app.route('/add-page', methods=['POST'])
def addPage():
    data = request.get_json('pageObj')
    pageId = data['pageId']
    projectName = data['projectName']
    projectDescription = data['projectDescription']
    pageLink = data['pageLink']
    teamId = data['teamId']
    imagePath = data['imagePath']
    result = db.insertPage(pageId, projectName, projectDescription, pageLink, teamId, imagePath)
    return result

@app.route('/add-team', methods=['POST'])
def addTeam():
    data = request.get_json('pageObj')
    teamId = data['teamId']
    confluenceLink = data['confluenceLink']
    imagePath = data['imagePath']
    result = db.insertTeam(teamId, confluenceLink, imagePath)
    return result

@app.route('/delete-team', methods=['POST'])
def deleteTeam():
    teamId = request.get_json('teamId')
    db.deleteTeam(teamId)
    return 'Team.js successfully added'

@app.route('/delete-page', methods=['POST'])
def deletePage():
    data = request.get_json('data')
    pageId = data['pageId']
    teamId = data['teamId']
    db.deletePage(pageId, teamId)
    return 'Page successfully deleted'


# Source: https://stackoverflow.com/questions/44926465/upload-image-in-flask
@app.route('/upload-diagram', methods=['POST'])
def upload_diagram():
    teamId = request.args.get('teamId')
    pageId = request.args.get('pageId')
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
            db.updateDiagramImgPath('../static/images/' + filename, teamId, pageId)
            return  redirect('/'+ teamId + '/' + pageId)
    return  ''

@app.route('/upload-team-image', methods=['POST'])
def upload_team_image():
    teamId = request.args.get('teamId')
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
            db.updateTeamImgPath('../static/images/' + filename, teamId)
            return  redirect('/'+ teamId)
    return  ''

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)

@app.route('/updateContent-position', methods=['POST'])
def updatePosition():
    data = request.get_json('obj')
    btnId = data['btnId']
    left = data['position']['left']
    top = data ['position']['top']
    pageId = data['pageId']
    teamId = data['teamId']
    db.updatePos(btnId, left, top, pageId, teamId)
    return 'Position successfully updated'

@app.route('/updateContent-size', methods=['POST'])
def updateSize():
    data = request.get_json('sizeObj')
    btnId = data['btnId']
    width = data['size']['width']
    height = data['size']['height']
    pageId = data['pageId']
    teamId = data['teamId']
    db.updateSize(btnId, width, height, pageId, teamId)
    return 'Size successfully updated'


@app.route('/add-button', methods=['POST'])
def addButton():
    btnObj = request.get_json('btnObj')
    btnId = btnObj['btnId']
    content = btnObj['content']
    left = btnObj['left']
    top = btnObj['top']
    width = btnObj['width']
    height = btnObj['height']
    pageId = btnObj['pageId']
    teamId = btnObj['teamId']
    result = db.insertButton(btnId, content, left, top, width, height, pageId, teamId)
    return result

@app.route('/updateContent-content', methods=['POST'])
def updateContent():
    data = request.get_json('newContentObj')
    originId = data['originId']
    newId = data['newId']
    newContent = data['newContent']
    pageId = data['pageId']
    teamId = data['teamId']
    result = db.updateContent(originId, newId, newContent, pageId, teamId)
    return  result


@app.route('/get-image')
def getImagePath():
    pageId = request.args.get('pageId')
    conn = sqlite3.connect(db.mainDataBasePath)
    c = conn.cursor()
    c.execute("SELECT  imagePath  from Page WHERE pageId= ? ", (pageId, ))
    result = c.fetchall()
    return jsonify(result)

@app.route('/get-popover-buttons', methods=['GET'])
def getPopoverBtns():
    pageId = request.args.get("pageId")
    teamId = request.args.get("teamId")
    conn = sqlite3.connect(db.mainDataBasePath)
    c = conn.cursor()
    c.execute("SELECT  *  from PopoverBtn WHERE pageId = ? and teamId = ?", (pageId, teamId))
    result = c.fetchall()
    return jsonify(result)

@app.route('/delete-button', methods=['POST'])
def deleteBtn():
    btnObj = request.get_json('btnObj')
    btnId = btnObj['btnId']
    pageId = btnObj['pageId']
    teamId = btnObj['teamId']
    db.deleteBtn(btnId, pageId, teamId)
    return 'Succesful'


# Source: http://flask.pocoo.org/docs/0.12/patterns/fileuploads/
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def getTeamsandPages():
    conn = sqlite3.connect(db.mainDataBasePath)
    c = conn.cursor()
    c.execute("""SELECT  Team.teamId, Team.imagePath, Page.pageId
                                from Team 
                                INNER JOIN Page ON Team.teamId = Page.teamId
                                """)
    results = c.fetchall()
    teams = []
    for result in results:
        teamId = result[0]
        teamImgPath = result[1]
        pageId = result[2]
        newTeam = {
            'teamId': teamId,
            'imagePath':  teamImgPath,
            'pageId': [pageId]
        }
        # If there is no team in the list
        if len(teams) == 0:
            teams.append(newTeam)
        else:
            isExist = False
            # Iterate throught the list
            for team in teams:
                # if teamId exist and pageId is not in the page list of the team
                if  teamId  == team['teamId']:
                    if pageId not in team['pageId']:
                        isExist = True
                        team['pageId'].append(pageId)
            # If the team does not exist
            if not isExist:
                teams.append(newTeam)
    return teams

def getTeamDetails(teamId):
    conn = sqlite3.connect(db.mainDataBasePath)
    c = conn.cursor()
    c.execute(""" SELECT Team.teamId, Team.confluenceLink, Team.imagePath, Page.pageId, Page.projectName, Page.projectDescription, Page.pageLink, Page.imagePath
                            FROM Team
                            INNER  JOIN Page ON Team.teamId = Page.teamId
                            WHERE Team.teamId = ?
                    """, (teamId, ))
    results = c.fetchall()
    teamDetails = {
        'teamId': teamId,
        'confluenceLink':  results[0][1],
        'imagePath': results[0][2],
        'pages':[]
    }
    for team in results:
        pageId = team[3]
        projectName = team[4]
        projectDescription = team[5]
        pageLink = team[6]
        imagePath = team[7]
        page = {
            'pageId': pageId,
            'projectName':projectName,
            'projectDescription': projectDescription,
            'pageLink':  pageLink,
            'imagePath': imagePath
        }
        teamDetails['pages'].append(page)
    conn.commit()
    conn.close()
    return teamDetails




if __name__ == '__main__':
    app.run(debug=True)