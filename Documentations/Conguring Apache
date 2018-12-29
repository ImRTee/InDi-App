# Configure the apache to run the WSGI file

# For httpd 2.2:
1. You can go straight to /etc/httpd/conf/httpd.conf
2. Go to the bottom where you will see the virtual host section
3. Remove the comment symbol '#'
4. Edit it as the <Virtual Host> section below

# For httpd 2.4,
1. Create a conf file in conf.d

    ```vi /etc/httpd/conf.d/[project-name].conf```
    
    
2. Add the <Virtual Host> section below  to the file

3. Make sure that there is the line  below to include all conf files (including the created one) in conf.d folder

    ```IncludeOptional conf.d/*.conf```

# NOTE: Replace [project-name] with the one you came up with
```
<VirtualHost *>
    ServerAdmin admin
    DocumentRoot var/www/html/document
    ServerName example.com

    #Create  WSGIDaemonProcess and tell it what the python path is and where the side packages are located
    WSGIDaemonProcess [project-name] python-path=/var/www/html/[project-name]:/var/www/html/[project-name]/venv/lib/python2.7/site-packages threads=5
    # Run flask.wsgi when there is a request made to /
    WSGIScriptAlias / /var/www/html/[project-name]/flask.wsgi
    WSGIProcessGroup [project-name]

    <Directory /var/www/html/[project-name]>
        Order deny,allow #For httpd 2.2
        Allow from all # For httpd 2.2
        Require all granted #For httpd 2.4
    </Directory>

    #Tell Apache where to generate the logs
    ErrorLog /var/www/[project-name]/error.log
    CustomLog /var/www/[project-name]/custom.log combined
</VirtualHost>
```