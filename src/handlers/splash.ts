import { Request, Response } from "express";

import characterInfo from "../../assets/data/characterInfo.json";
import { getSource } from "../modules/getSource";

function getCharacter(characterName: string, res: Response) {
  const normalizedName = characterName.toLowerCase().replace(/[-_]/g, " ");
  const character = characterInfo[normalizedName as keyof typeof characterInfo];
  if (!character) {
    res.statusCode = 404;
    throw new Error("Character not found");
  }
  return character;
}

export function getNamesList() {
  let namesArray = [];
  for (let name in characterInfo) {
    namesArray.push(name);
  }
  return namesArray;
}

export function getNames(req: Request, res: Response) {
  let namesArray = getNamesList();
  res.send({ availableSplashes: namesArray });
  return;
}

export function getSplash(req: Request, res: Response) {
  const { characterName } = req.params;
  const character = getCharacter(characterName, res);
  const fileCharacterName = characterName.toLowerCase().replace(/[ -]/g, "_");
  const url = `/images/character_icons/${fileCharacterName}.png`;
  getSource(url, res, "image/png");
  return;
}

export function getSplashPixelated(req: Request, res: Response) {
  const { characterName, pixelatedId } = req.params;
  const character = getCharacter(characterName, res);
  const fileCharacterName = characterName.toLowerCase().replace(/[ -]/g, "_");

  if (
    isNaN(parseInt(pixelatedId)) ||
    parseInt(pixelatedId) < 1 ||
    parseInt(pixelatedId) > 4
  ) {
    res.statusCode = 404;
    throw new Error("Pixelated images need an id from 1 to 4");
  } else {
    const url = `/images/character_splashes/pixelated/${fileCharacterName}_splash_pixelated_${pixelatedId}.png`;
    getSource(url, res, "image/png");
    return;
  }
}
