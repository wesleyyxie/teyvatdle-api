import { Request, Response } from "express";

import characterInfo from "../../assets/data/characterInfo.json";
import { getSource } from "../modules/getSource";

/**
 * Normalizes and validates character name for lookup
 *
 * @param characterName - The name of the character to look up
 * @param res - Express response object for error handling
 * @returns Character information or throws an error
 */
function getCharacterInfo(characterName: string, res: Response) {
  const normalizedName = characterName.toLowerCase().replace(/[-_]/g, " ");
  const character = characterInfo[normalizedName as keyof typeof characterInfo];

  if (!character) {
    res.status(404);
    throw new Error(`Character not found`);
  }

  return character;
}

/**
 * Retrieves all character information
 */
export function getCharacters(req: Request, res: Response) {
  res.json(characterInfo);
}

/**
 * Retrieves information for a specific character
 */
export function getCharacterByName(req: Request, res: Response) {
  const { characterName } = req.params;
  const character = getCharacterInfo(characterName, res);
  res.json(character);
}

/**
 * Retrieves the icon for a specific character
 */
export function getCharacterIcon(req: Request, res: Response) {
  const { characterName, icon } = req.params;

  // Validate character exists
  getCharacterInfo(characterName, res);

  // Validate icon parameter
  if (icon !== "icon") {
    res.status(404);
    throw new Error("Item not found, use 'icon'");
  }

  // Normalize character name for file path
  const fileCharacterName = characterName.toLowerCase().replace(/[ -]/g, "_");
  const url = `/images/character_icons/${fileCharacterName}.png`;

  // Fetch and send icon
  getSource(url, res, "image/png");
}
