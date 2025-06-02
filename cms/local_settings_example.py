'''This is an example Python script for local_settings.py.'''

import os
from dotenv import load_dotenv
load_dotenv()

BASE_DIR = os.path.abspath('.')

FRONTEND_HOST='http://127.0.0.1:8000'
PORTAL_NAME='MediaCMS'
SSL_FRONTEND_HOST=FRONTEND_HOST.replace('http', 'https')
SECRET_KEY=os.getenv('SECRET_KEY')
LOCAL_INSTALL=True
DEBUG = True
STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]
STATIC_ROOT = os.path.join(BASE_DIR, 'static_collected')

# Whisper CPP directory
# WHISPER_COMMAND = "/Desktop/jay-js-workspaces/mediacms.io/wh"
WHISPER_CPP_COMMAND = "/Desktop/jay-js-workspaces/mediacms.io/whisper.cpp/main"
WHISPER_CPP_MODEL = "/Desktop/jay-js-workspaces/mediacms.io/whisper.cpp/models/ggml-large-v3.bin"