from abilities_data import get_abilities_data
from ability_icons import get_ability_icons
from character_data import get_character_data
from character_icons import get_character_icons
from character_splash import get_splashes
from pixelate_splash_arts import pixelate_images
from voicelines import get_voicelines, download_wav

import os
import shutil
import pyrebase
import os

path_to_audio = "./assets/audios/"
path_to_images = "./assets/images/"
path_to_ability_icons = "./assets/images/ability_icons/"
path_to_character_icons = "./assets/images/character_icons/"
path_to_character_splash_pixelated = "./assets/images/character_splashes/pixelated/"
path_to_character_splash_nonpixelated = (
    "./assets/images/character_splashes/non-pixelated/"
)
firebase_config = {
    "apiKey": "AIzaSyBkfUTPMnUP7tFz7dQmLRbs8-xjskMJZ5M",
    "authDomain": "teyvatdle-api.firebaseapp.com",
    "projectId": "teyvatdle-api",
    "storageBucket": "teyvatdle-api.firebasestorage.app",
    "messagingSenderId": "409440288658",
    "appId": "1:409440288658:web:863975c5b015cf3dfc8b4b",
    "measurementId": "G-D1CF1GCZZ6",
    "databaseURL": "",
}


def get_data_and_images():
    get_character_data()
    get_abilities_data()
    get_character_icons()
    get_ability_icons()
    get_splashes()
    pixelate_images()
    get_voicelines()
    download_wav()


def upload_images(path, storage):
    path_cloud = path.split("assets")[1]
    for file in os.listdir(path):
        print(file)
        storage.child(f"{path_cloud}{file}").put(f"{path}{file}")


def upload_to_firebase():

    firebase = pyrebase.initialize_app(firebase_config)
    storage = firebase.storage()
    upload_images(path_to_audio, storage)
    upload_images(path_to_ability_icons, storage)
    upload_images(path_to_character_icons, storage)
    upload_images(path_to_character_splash_pixelated, storage)
    upload_images(path_to_character_splash_nonpixelated, storage)


def delete_images_and_audios():
    # Try to remove the tree; if it fails, throw an error using try...except.
    try:
        shutil.rmtree(path_to_audio)
        shutil.rmtree(path_to_images)
    except OSError as e:
        print("Error: %s - %s." % (e.filename, e.strerror))


def update_character_files():
    get_data_and_images()
    upload_to_firebase()
    delete_images_and_audios()
