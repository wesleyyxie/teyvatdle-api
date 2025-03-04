import { Request, Response } from "express";

import voicelines from "../../assets/data/voicelines.json";
import { getSource } from "../modules/getSource";

function getCharacterVoicelines(characterName: string, res: Response) {
  const normalizedName = characterName.toLowerCase().replace(/[-_]/g, " ");
  // Check if character exists
  const characterVoicelines =
    voicelines[normalizedName as keyof typeof voicelines];
  if (!characterVoicelines) {
    res.statusCode = 404;
    throw new Error("Character not found");
  }
  return characterVoicelines;
}

function getVoicelineById(characterName: string, id: string, res: Response) {
  const characterVoicelines = getCharacterVoicelines(characterName, res);
  if (isNaN(parseInt(id)) || parseInt(id) < 0 || parseInt(id) > 3) {
    res.statusCode = 404;
    throw new Error("Voiceline Id needs to be a number between 0 and 3");
  }
  return characterVoicelines[id as keyof typeof characterVoicelines];
}

export function getVoicelines(req: Request, res: Response) {
  res.send(voicelines);
  return;
}

export function getVoicelinesByName(req: Request, res: Response) {
  const { characterName } = req.params;
  // Normalize character name for lookup
  const characterVoicelines = getCharacterVoicelines(characterName, res);
  res.send(characterVoicelines);
  return;
}

export function getVoicelinesByNameAndId(req: Request, res: Response) {
  const { characterName, id } = req.params;
  const voiceline = getVoicelineById(characterName, id, res);
  res.send(voiceline);
  return;
}

export function getAudio(req: Request, res: Response) {
  const { characterName, id, audio } = req.params;
  const voiceline = getVoicelineById(characterName, id, res);
  if (audio != "audio") {
    res.statusCode = 404;
    throw new Error("Item not found. Please use 'audio'");
  }
  const url = `/audios/${characterName.toLowerCase().replace(/( )|(-)/, "_")}${id}.wav`;
  getSource(url, res, "audio/wav");
  return;
}
