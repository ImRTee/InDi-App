# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary: 
* Version 4.0

### How do I get set up? ###

* This a flask application, you can deploy it on either apache or nginx server. To configure the webserver to run a flash app, we will wsgi (Web Server Gateway Interface, a specification that describes how a web server communicates with web applications, and how web applications can be chained together to process one request. In the next section, I will show you how to deploy InDi App to an Apache server. 

### Local Environment Set Up
#### Prerequisites
1. Python > 2.7  
2. Pip
3. Virtualenv

#### The Process
##### 1. Clone the project to your local machine
    git clone https://ImRTee@bitbucket.org/ImRTee/indi-app.git

##### 2. Create the virtual env
Navigate to the project folder where you clone it to and create an virtual environment there. 
    
    cd /path/to/your/project
    virtualenv venv 
    
##### 3. Activate your virtual environment to install packages that are only related to 

    source /var/www/[project-name]/venv/bin/activate (Linux)
    .\venv\Scripts\activate (Window)
    pip install requirement.txt (if not works, just use pip install python)

##### 4. Run app.py in the source folder to start the app. 

    python src/app.py



### Deployment instructions: 
#### Prerequisites
1. Install mod_uwsgi (on the server)
   `yum install mod_wsgi`
2. Python > 2.7  
3. Pip

#### The Process
##### 1. Clone the code files to the server at /var/www/html/[project-name] (2 options)
1. Github
    cd /var/www/html/project-name
    git clone [git-source]

2. From your local machine#On your local machinecd /path/to/your/project/ 
    scp ./* user@[your server ip address]:/var/www/html/[project-name]  

##### 2.Create the virtual environment for the project (Created environment stored in the venv folder)
    cd /var/www/html/[project-name]
    virtualenv venv

##### 3. Activate your virtual environment to install packages that are only related to 

    source /var/www/[project-name]/venv/bin/activate
    pip install requirement.txt

##### 4. Configure .wsgi file

You can find that flask.wsgi located at /var/www/html/[project-name]/.

In the file,  replace [project-name] with the one you came up with
    
##### 5. Configure apache to execute that .wsgi folder

Use the documentation 'Configuring Apache' located in Documentation folder in this repository 

##### 6. Start the Apache server 

```service httpd start #restart if you have started it.```



