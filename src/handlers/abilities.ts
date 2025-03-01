import { Request, Response } from "express";

import abilities from "../../assets/data/abilities.json";
import { getSource } from "../modules/getSource";

function getAbilitiesByCharacter(characterName: string, res: Response) {
  const normalizedName = characterName.toLowerCase().replace(/[-_]/g, " ");
  const abiltiiesCharacter =
    abilities[normalizedName as keyof typeof abilities];
  if (!abiltiiesCharacter) {
    res.statusCode = 404;
    throw new Error("Character not found");
  }
  return abiltiiesCharacter;
}

function getAbilityByCharacterAndType(
  characterName: string,
  type: string,
  res: Response
) {
  const abilitiesCharacter = getAbilitiesByCharacter(characterName, res);
  if (type != "skill" && type != "burst") {
    res.statusCode = 404;
    throw new Error("Invalid ability type, use 'burst' or 'skill'");
  }
  return abilitiesCharacter[type as keyof typeof abilitiesCharacter];
}

export function getAbilities(req: Request, res: Response) {
  res.send(abilities);
  return;
}

export function getAbilitiesByName(req: Request, res: Response) {
  const { characterName } = req.params;
  const abilitiesCharacter = getAbilitiesByCharacter(characterName, res);
  res.send(abilitiesCharacter);
  return;
}

export function getAbilityByType(req: Request, res: Response) {
  const { characterName, type } = req.params;
  const ability = getAbilityByCharacterAndType(characterName, type, res);
  res.send(ability);
  return;
}

export function getAbilityIcon(req: Request, res: Response) {
  const { characterName, type, icon } = req.params;
  const ability = getAbilityByCharacterAndType(characterName, type, res);
  if (icon != "icon") {
    res.statusCode = 404;
    throw new Error("Item not found, use 'icon' in url path");
  }
  let url = `/images/ability_icons/${ability.name.toLowerCase().replace(/( )|(-)/, "_")}_${type}.png`;
  getSource(url, res, "image/png");
  return;
}
