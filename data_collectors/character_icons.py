import json
import requests
from PIL import Image
from io import BytesIO
import os

OUTPUT_FILE = "./assets/images/character_icons"
CHARACTER_INFO = "./assets/data/characterInfo.json"


def get_character_icons():
    if not os.path.exists(OUTPUT_FILE):
        os.makedirs(OUTPUT_FILE)
    with open(CHARACTER_INFO) as characters_json:
        characters_info = json.load(characters_json)
        for a in characters_info:
            res_image = requests.get(characters_info[a]["iconSource"])
            image = Image.open(BytesIO(res_image.content)).convert("RGBA")
            file_name = f"{characters_info[a]["name"].lower().replace(" ", "_")}.png"
            image.save(f"{OUTPUT_FILE}/{file_name}", "PNG", optimize=True)
