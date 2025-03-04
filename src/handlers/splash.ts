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
function getCharacter(characterName: string, res: Response) {
  const normalizedName = characterName.toLowerCase().replace(/[-_]/g, " ");
  const character = characterInfo[normalizedName as keyof typeof characterInfo];

  if (!character) {
    res.status(404);
    throw new Error(`Character not found`);
  }

  return character;
}

/**
 * Retrieves a list of all character names
 *
 * @returns Array of character names
 */
export function getNamesList(): string[] {
  return Object.keys(characterInfo);
}

/**
 * Sends a list of available splash art character names
 */
export function getNames(req: Request, res: Response) {
  const namesArray = getNamesList();
  res.json({ availableSplashes: namesArray });
}

/**
 * Retrieves the splash art for a specific character
 */
export function getSplash(req: Request, res: Response) {
  const { characterName } = req.params;

  // Validate character exists
  getCharacter(characterName, res);

  // Generate file name
  const fileCharacterName = characterName.toLowerCase().replace(/[ -]/g, "_");
  const url = `/images/character_splashes/non-pixelated/${fileCharacterName}_splash.png`;

  // Fetch and send image
  getSource(url, res, "image/png");
}

/**
 * Retrieves a pixelated splash art for a specific character
 */
export function getSplashPixelated(req: Request, res: Response) {
  const { characterName, pixelatedId } = req.params;

  // Validate character exists
  getCharacter(characterName, res);

  // Generate file name
  const fileCharacterName = characterName.toLowerCase().replace(/[ -]/g, "_");

  // Validate pixelated ID
  const parsedId = parseInt(pixelatedId);
  if (isNaN(parsedId) || parsedId < 1 || parsedId > 4) {
    res.status(404);
    throw new Error("Pixelated images need an id from 1 to 4");
  }

  // Generate URL and fetch image
  const url = `/images/character_splashes/pixelated/${fileCharacterName}_splash_pixelated_${pixelatedId}.png`;
  getSource(url, res, "image/png");
}
