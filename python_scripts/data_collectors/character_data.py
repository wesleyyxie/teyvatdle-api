import json
from bs4 import BeautifulSoup

from selenium import webdriver
from time import sleep
import os

OUTPUT_FILE = "./assets/data/characterInfo.json"
DIRECTORY = "./assets/data"
WIKI_PAGE_LINK = "https://genshin-impact.fandom.com/wiki/Character/List"


def get_source_code(url):
    driver = webdriver.Firefox()
    driver.get(url)
    sleep(3)
    source_code = driver.page_source
    driver.quit()
    return source_code


def get_character_data():
    if not os.path.exists(DIRECTORY):
        os.makedirs(DIRECTORY)
    with open(OUTPUT_FILE, "w+") as json_file:
        soup = BeautifulSoup(get_source_code(WIKI_PAGE_LINK), "html.parser")
        rows = soup.tbody.find_all("tr")

        attributes = {0: "name", 3: "vision", 4: "weapon", 5: "region"}
        characters_dict = {}
        for row in rows:
            character_info = {}
            columns = row.find_all("td")

            # Gets attribute in dict
            for i in [0, 3, 4, 5]:
                a_tag = columns[i].a

                if a_tag is not None:
                    character_info[attributes[i]] = a_tag.get("title")
                else:
                    character_info[attributes[i]] = "Unknown"

            character_info["iconSource"] = (
                columns[0].find("img")["data-src"].split("latest")[0] + "latest"
            )
            # Gets gender
            gender_txt = (columns[6].a).get("title")
            if "Male" in gender_txt:
                character_info["gender"] = "Male"
            else:
                character_info["gender"] = "Female"

            # Gets release year
            character_info["release"] = columns[7].text[-5:-1]
            if character_info["name"] != "Traveler":
                characters_dict[character_info["name"].lower()] = character_info

        json.dump(characters_dict, json_file, indent=4)


if __name__ == "__main__":
    get_character_data()
