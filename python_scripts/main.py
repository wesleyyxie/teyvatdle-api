from data_collectors.abilities_data import get_abilities_data
from data_collectors.ability_icons import get_ability_icons
from data_collectors.character_data import get_character_data
from data_collectors.character_icons import get_character_icons
from data_collectors.character_splash import get_splashes
from data_collectors.pixelate_splash_arts import pixelate_images
from data_collectors.voicelines import get_voicelines, download_wav

import os
import shutil
import pyrebase
from dotenv import load_dotenv

path_to_audio = "./assets/audios/"
path_to_images = "./assets/images/"
path_to_ability_icons = "./assets/images/ability_icons/"
path_to_character_icons = "./assets/images/character_icons/"
path_to_character_splash_pixelated = "./assets/images/character_splashes/pixelated/"
path_to_character_splash_nonpixelated = (
    "./assets/images/character_splashes/non-pixelated/"
)

load_dotenv()
firebase_config = {
    "apiKey": os.getenv("FIREBASE_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.getenv("FIREBASE_APP_ID"),
    "measurementId": os.getenv("FIREBASE_MEASUREMENT_ID"),
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


def upload_images(path, storage, user):
    path_cloud = path.split("assets")[1]
    for file in os.listdir(path):
        print(file)
        storage.child(f"{path_cloud}{file}").put(f"{path}{file}", user["idToken"])


def upload_to_firebase():

    firebase = pyrebase.initialize_app(firebase_config)
    auth = firebase.auth()
    user = auth.sign_in_with_email_and_password(
        os.getenv("FIREBASE_EMAIL"), os.getenv("FIREBASE_PASSWORD")
    )
    storage = firebase.storage()
    upload_images(path_to_audio, storage, user)
    upload_images(path_to_ability_icons, storage, user)
    upload_images(path_to_character_icons, storage, user)
    upload_images(path_to_character_splash_pixelated, storage, user)
    upload_images(path_to_character_splash_nonpixelated, storage, user)


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


if "__main__" == __name__:
    # get_character_data()
    # get_abilities_data()
    get_voicelines()
