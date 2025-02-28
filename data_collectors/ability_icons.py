import json
import requests
from PIL import Image
from io import BytesIO
import os

OUTPUT_FILE = "./assets/images/ability_icons"
ABILITIES_INFO = "./assets/data/abilities.json"


def get_ability_icons():
    if not os.path.exists(OUTPUT_FILE):
        os.makedirs(OUTPUT_FILE)
    with open(ABILITIES_INFO) as abilities_json:
        abilities_info = json.load(abilities_json)
        for name in abilities_info:
            for a in abilities_info[name]:
                type = a
                source = abilities_info[name][a]["imageSource"]
                print(name)
                res_image = requests.get(source)
                image = Image.open(BytesIO(res_image.content)).convert("RGBA")
                file_name = f"{name.lower().replace(" ", "_")}_{type}.png"
                image.save(f"{OUTPUT_FILE}/{file_name}", "PNG", optimize=True)


if __name__ == "__main__":
    get_ability_icons()
