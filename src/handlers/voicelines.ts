import { Request, Response } from "express";

import voicelines from "../../assets/data/voicelines.json";
import { getSource } from "../modules/getSource";

/**
 * Normalizes and validates character name for voiceline lookup
 *
 * @param characterName - The name of the character to look up
 * @param res - Express response object for error handling
 * @returns Character's voicelines or throws an error
 */
function getCharacterVoicelines(characterName: string, res: Response) {
  const normalizedName = characterName.toLowerCase().replace(/[-_]/g, " ");

  // Check if character exists
  const characterVoicelines =
    voicelines[normalizedName as keyof typeof voicelines];

  if (!characterVoicelines) {
    res.status(404);
    throw new Error(`Character not found`);
  }

  return characterVoicelines;
}

/**
 * Validates and retrieves a specific voiceline by ID
 *
 * @param characterName - The name of the character
 * @param id - The ID of the voiceline
 * @param res - Express response object for error handling
 * @returns Specific voiceline or throws an error
 */
function getVoicelineById(characterName: string, id: string, res: Response) {
  const characterVoicelines = getCharacterVoicelines(characterName, res);

  const parsedId = parseInt(id);
  if (isNaN(parsedId) || parsedId < 0 || parsedId > 3) {
    res.status(404);
    throw new Error("Voiceline Id needs to be a number between 0 and 3");
  }

  return characterVoicelines[id as keyof typeof characterVoicelines];
}

/**
 * Retrieves all voicelines
 */
export function getVoicelines(req: Request, res: Response) {
  res.json(voicelines);
}

/**
 * Retrieves voicelines for a specific character
 */
export function getVoicelinesByName(req: Request, res: Response) {
  const { characterName } = req.params;
  const characterVoicelines = getCharacterVoicelines(characterName, res);
  res.json(characterVoicelines);
}

/**
 * Retrieves a specific voiceline for a character
 */
export function getVoicelinesByNameAndId(req: Request, res: Response) {
  const { characterName, id } = req.params;
  const voiceline = getVoicelineById(characterName, id, res);
  res.json(voiceline);
}

/**
 * Retrieves audio for a specific voiceline
 */
export function getAudio(req: Request, res: Response) {
  const { characterName, id, audio } = req.params;

  // Validate voiceline first
  getVoicelineById(characterName, id, res);

  // Validate audio parameter
  if (audio !== "audio") {
    res.status(404);
    throw new Error("Item not found. Please use 'audio'");
  }

  // Generate URL for audio file
  const url = `/audios/${characterName.toLowerCase().replace(/( )|(-)/g, "_")}${id}.wav`;

  // Fetch and send audio
  getSource(url, res, "audio/wav");
}
