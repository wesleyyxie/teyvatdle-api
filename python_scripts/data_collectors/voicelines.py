import requests
from bs4 import BeautifulSoup
import re
import json

import os
import glob

from pydub import AudioSegment

CHARACTER_INFO_PATH = "./assets/data/characterInfo.json"
VOICELINES_JSON_PATH = "./assets/data/voicelines.json"
VOICELINES_FILES_PATH = "./assets/audios"


def get_voicelines():
    voicelines_dict = {}
    if not os.path.exists(VOICELINES_FILES_PATH):
        os.makedirs(VOICELINES_FILES_PATH)
    with open(VOICELINES_JSON_PATH, "w+") as json_file:
        with open(CHARACTER_INFO_PATH, "r") as character_info:
            info = json.load(character_info)
            for c in info:
                voicelines = {}
                character_name = info[c]["name"]
                print(character_name)
                response = requests.get(
                    f"https://genshin-impact.fandom.com/wiki/{character_name}/Voice-Overs"
                )
                html_content = response.text
                soup_page = BeautifulSoup(html_content, "html.parser")
                tables = soup_page.find_all("table", class_="wikitable")

                not_attacks_tds = []
                not_attacks = tables[0].find_all("td")
                for td in not_attacks:
                    if td.find(attrs={"lang": "en"}):
                        not_attacks_tds.append(td)

                attacks_td = []
                attacks = tables[1].find_all("td")
                for td in attacks:
                    if td.find(attrs={"lang": "en"}):
                        attacks_td.append(td)

                i = 0
                for t in not_attacks_tds:
                    if i > 1:
                        break
                    voiceline = {}
                    audio = t.find("audio")
                    if audio != -1:
                        audio_src = audio.get("src")
                    quote_span_tag = t.find(attrs={"lang": "en"})
                    if quote_span_tag:
                        for a in quote_span_tag.find_all("a"):
                            a_text = a.get_text()  # Get the text inside the <a> tag
                            a.replace_with(a_text)  # Replace <a> with its text

                        quote_text = quote_span_tag.get_text()
                        voiceline["name"] = character_name
                        voiceline["audio"] = audio_src
                        voiceline["quote"] = quote_text
                        voiceline["voicelineId"] = i

                        name_parts = character_name.split()
                        name_in_quote = False
                        for p in name_parts:
                            if p in quote_text:
                                name_in_quote = True
                        if (
                            name_in_quote == False
                            and len(quote_text.split()) >= 5
                            and len(quote_text.split()) <= 15
                        ):
                            voicelines[voiceline["voicelineId"]] = voiceline
                            i += 1

                j = 2
                for t in attacks_td:
                    if j > 3:
                        break
                    voiceline = {}
                    audio = t.find("audio")
                    if audio != -1 and audio is not None:
                        audio_src = audio.get("src")
                    quote_span_tag = t.find(attrs={"lang": "en"})
                    if quote_span_tag:
                        for a in quote_span_tag.find_all("a"):
                            a_text = a.get_text()  # Get the text inside the <a> tag
                            a.replace_with(a_text)  # Replace <a> with its text

                        quote_text = quote_span_tag.get_text()
                        quote_text = re.sub(r"\(.*?\)\s*", "", quote_text)
                        voiceline["name"] = character_name
                        voiceline["audio"] = audio_src
                        voiceline["quote"] = quote_text
                        voiceline["voicelineId"] = j

                        name_parts = character_name.split()
                        name_in_quote = False
                        for p in name_parts:
                            if p in quote_text:
                                name_in_quote = True
                        if (
                            name_in_quote == False
                            and len(quote_text.split()) >= 5
                            and len(quote_text.split()) <= 15
                            and "~" not in quote_text
                        ):
                            voicelines[voiceline["voicelineId"]] = voiceline
                            j += 1
                voicelines_dict[voiceline["name"].lower()] = voicelines
            json.dump(voicelines_dict, json_file, indent=4)


def download_wav():
    current_files = glob.glob(f"{VOICELINES_FILES_PATH}/*")
    for f in current_files:
        os.remove(f)

    with open(VOICELINES_JSON_PATH, "r") as json_file:
        voicelines_file = json.load(json_file)
        for name in voicelines_file:
            for v in voicelines_file[name]:
                r = requests.get(voicelines_file[name][v]["audio"])
                voiceline_id = voicelines_file[name][v]["voicelineId"]
                with open(
                    f"{VOICELINES_FILES_PATH}/{name.lower().replace(" ","_")}{voiceline_id}.mp3",
                    "wb",
                ) as mp3_file:
                    mp3_file.write(r.content)

                mp3 = AudioSegment.from_file(
                    f"{VOICELINES_FILES_PATH}/{name.lower().replace(" ","_")}{voiceline_id}.mp3"
                )
                mp3.export(
                    f"{VOICELINES_FILES_PATH}/{name.lower().replace(" ","_")}{voiceline_id}.wav",
                    format="wav",
                )
                os.remove(
                    os.path.abspath(
                        f"{VOICELINES_FILES_PATH}/{name.lower().replace(" ","_")}{voiceline_id}.mp3"
                    )
                )


if __name__ == "__main__":
    # get_voicelines()
    download_wav()
