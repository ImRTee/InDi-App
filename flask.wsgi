# Note: change all [project-name] to the one you came up with

#!/bin/python
import os
import sys

#Let the wsgi know where to activate your virtual environment
activate_this = '/var/www/html/[project-name]/venv/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

##Replace the standard out
sys.stdout = sys.stderr

##Add this file path to sys.path in order to import settings
sys.path.insert(0, os.path.join(os.path.dirname(os.path.realpath(__file__)), '../..'))

#Add this file path to sys.path in order to import app
sys.path.append('/var/www/html/[project-name]/')

from src.app import app as application