import json
import requests
from PIL import Image
import os
from io import BytesIO
from bs4 import BeautifulSoup

WIKI_URL = "https://genshin-impact.fandom.com/wiki/Wish/Gallery"
PATH_CHARACTER_INFO = "./assets/data/characterInfo.json"
PATH_TO_SPLASH_FOLDER = "./assets/images/character_splashes/non-pixelated"


def create_splashes(info):
    response = requests.get(WIKI_URL)

    html_content = response.text
    soup_page = BeautifulSoup(html_content, "html.parser")
    gallery_container = soup_page.find("div", id="gallery-3")
    item_containers = gallery_container.find_all("div", class_="wikia-gallery-item")

    for i in item_containers:
        url = i.find("img").get("src").split(".png")[0] + ".png"
        character_name = url[
            len(
                "https://static.wikia.nocookie.net/gensin-impact/images/c/c3/Character_"
            ) : -len("_Full_Wish.png")
        ]

        print(url)
        response_burst = requests.get(url, timeout=30)
        splash = Image.open(BytesIO(response_burst.content)).convert("RGBA")
        original_width, original_height = splash.size

        if original_height > original_width:
            new_dimension = original_height
        else:
            new_dimension = original_width

        new_splash = Image.new("RGBA", (new_dimension, new_dimension), (0, 0, 0, 0))
        position = (
            (new_dimension - original_width) // 2,
            (new_dimension - original_height) // 2,
        )
        new_splash.paste(splash, position, splash)

        # Reduce color depth (for lower quality)
        reduced_splash = new_splash.convert("P", palette=Image.ADAPTIVE, colors=256)

        for c in info:
            if info[c]["name"].lower().replace(" ", "_") == character_name.lower():
                # Save as PNG with reduced quality (through reduced color depth)
                save_path = os.path.join(
                    PATH_TO_SPLASH_FOLDER,
                    f"{info[c]["name"].lower().replace(" ", "_")}_splash.png",
                )
                reduced_splash.save(save_path, "PNG", optimize=True)


def get_splashes():
    if not os.path.exists(PATH_TO_SPLASH_FOLDER):
        os.makedirs(PATH_TO_SPLASH_FOLDER)
    with open(PATH_CHARACTER_INFO) as character_info:
        info = json.load(character_info)
        create_splashes(info)
