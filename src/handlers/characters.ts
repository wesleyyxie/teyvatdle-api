import { Request, Response } from "express";

import characterInfo from "../../assets/data/characterInfo.json";
import { getSource } from "../modules/getSource";

function getCharacterInfo(characterName: string, res: Response) {
  const normalizedName = characterName.toLowerCase().replace(/[-_]/g, " ");
  const character = characterInfo[normalizedName as keyof typeof characterInfo];
  if (!character) {
    res.statusCode = 404;
    throw new Error("Character not found");
  }
  return character;
}

export function getCharacters(req: Request, res: Response) {
  res.send(characterInfo);
  return;
}

export function getCharacterByName(req: Request, res: Response) {
  const { characterName } = req.params;
  const character = getCharacterInfo(characterName, res);
  res.send(character);
  return;
}

export function getCharacterIcon(req: Request, res: Response) {
  const { characterName, icon } = req.params;
  const character = getCharacterInfo(characterName, res);
  // Check if character exists
  if (icon != "icon") {
    res.statusCode = 404;
    throw new Error("Item not found, use 'icon'");
  } else {
    // Normalize character name for file path
    const fileCharacterName = characterName.toLowerCase().replace(/[ -]/g, "_");
    let url = "";
    // Determine image URL based on imageType
    url = `/images/character_icons/${fileCharacterName}.png`;
    getSource(url, res, "image/png");
    return;
  }
}
