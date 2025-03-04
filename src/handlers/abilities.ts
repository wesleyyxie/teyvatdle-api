import { Request, Response } from "express";

import abilities from "../../assets/data/abilities.json";
import { getSource } from "../modules/getSource";

/**
 * Normalizes and validates character name for abilities lookup
 *
 * @param characterName - The name of the character to look up
 * @param res - Express response object for error handling
 * @returns Character's abilities or throws an error
 */
function getAbilitiesByCharacter(characterName: string, res: Response) {
  const normalizedName = characterName.toLowerCase().replace(/[-_]/g, " ");
  const abilitiesCharacter =
    abilities[normalizedName as keyof typeof abilities];

  if (!abilitiesCharacter) {
    res.status(404);
    throw new Error(`Character not found`);
  }

  return abilitiesCharacter;
}

/**
 * Validates and retrieves a specific ability type for a character
 *
 * @param characterName - The name of the character
 * @param type - The ability type (skill or burst)
 * @param res - Express response object for error handling
 * @returns Specific ability or throws an error
 */
function getAbilityByCharacterAndType(
  characterName: string,
  type: string,
  res: Response
) {
  const abilitiesCharacter = getAbilitiesByCharacter(characterName, res);

  if (type !== "skill" && type !== "burst") {
    res.status(404);
    throw new Error("Invalid ability type, use 'burst' or 'skill'");
  }

  return abilitiesCharacter[type as keyof typeof abilitiesCharacter];
}

/**
 * Retrieves all abilities
 */
export function getAbilities(req: Request, res: Response) {
  res.json(abilities);
}

/**
 * Retrieves abilities for a specific character
 */
export function getAbilitiesByName(req: Request, res: Response) {
  const { characterName } = req.params;
  const abilitiesCharacter = getAbilitiesByCharacter(characterName, res);
  res.json(abilitiesCharacter);
}

/**
 * Retrieves a specific ability type for a character
 */
export function getAbilityByType(req: Request, res: Response) {
  const { characterName, type } = req.params;
  const ability = getAbilityByCharacterAndType(characterName, type, res);
  res.json(ability);
}

/**
 * Retrieves the icon for a specific ability
 */
export function getAbilityIcon(req: Request, res: Response) {
  const { characterName, type, icon } = req.params;

  // Validate ability and type
  const ability = getAbilityByCharacterAndType(characterName, type, res);

  // Validate icon parameter
  if (icon !== "icon") {
    res.status(404);
    throw new Error("Item not found, use 'icon' in url path");
  }

  // Generate icon URL
  const url = `/images/ability_icons/${ability.name.toLowerCase().replace(/( )|(-)/, "_")}_${type}.png`;

  // Fetch and send icon
  getSource(url, res, "image/png");
}
