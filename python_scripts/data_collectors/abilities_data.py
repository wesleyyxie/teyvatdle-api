import requests
import json
from bs4 import BeautifulSoup
import os

OUTPUT_FILE = "./assets/data/abilities.json"
WIKI_PAGE_LINK_BURST = "https://genshin-impact.fandom.com/wiki/Elemental_Burst/List"
WIKI_PAGE_LINK_SKILL = "https://genshin-impact.fandom.com/wiki/Elemental_Skill/List"
DIRECTORY = "./assets/data"


def get_burst_data(abilities_dict):
    res_burst = requests.get(WIKI_PAGE_LINK_BURST)
    soup_burst = BeautifulSoup(res_burst.text, "html.parser")

    table = soup_burst.find(
        "table", class_="article-table sortable alternating-colors-table tdc1"
    )

    rows = table.find_all("tr")

    for r in rows[1:]:
        burst_data = {}

        burst_container = r.find("span", class_="talent-text")
        name_container = r.find("span", class_="item-text")
        image_container = r.find("img")

        burst_data["name"] = name_container.text[1:]
        burst_data["abilityName"] = burst_container.text
        burst_data["type"] = "burst"
        burst_data["imageSource"] = (
            image_container["data-src"].split("latest")[0] + "latest"
        )

        if "Traveler" not in burst_data["name"]:
            abilities_dict[burst_data["name"].lower()][burst_data["type"]] = burst_data


def get_skill_data(abilities_dict):
    res_skill = requests.get(WIKI_PAGE_LINK_SKILL)
    soup_skill = BeautifulSoup(res_skill.text, "html.parser")

    table = soup_skill.find(
        "table", class_="article-table sortable alternating-colors-table tdc1"
    )

    rows = table.find_all("tr")

    for r in rows[1:]:
        skill_data = {}

        skill_container = r.find("span", class_="talent-text")
        name_container = r.find("span", class_="item-text")
        image_container = r.find("img")

        skill_data["name"] = name_container.text[1:]
        skill_data["abilityName"] = skill_container.text
        skill_data["type"] = "skill"
        skill_data["imageSource"] = (
            image_container["data-src"].split("latest")[0] + "latest"
        )

        if "Traveler" not in skill_data["name"]:
            abilities_dict[skill_data["name"].lower()] = {
                skill_data["type"]: skill_data
            }


def get_abilities_data():
    if not os.path.exists(DIRECTORY):
        os.makedirs(DIRECTORY)
    abilities_dict = {}
    get_skill_data(abilities_dict)
    get_burst_data(abilities_dict)
    with open(OUTPUT_FILE, "w+") as json_file:
        json.dump(abilities_dict, json_file, indent=4)


get_abilities_data()
