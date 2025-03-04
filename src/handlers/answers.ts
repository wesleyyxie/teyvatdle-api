import { Request, Response } from "express";
import { getAnswer } from "../database/answers";
import characterInfo from "../../assets/data/characterInfo.json";
import abilities from "../../assets/data/abilities.json";
import voicelines from "../../assets/data/voicelines.json";

// Fetch the most recent classic mode answer from the database
async function getClassicAnswer() {
  const answerClassicDB = await getAnswer("classic");

  // Retrieve the corresponding character info from the JSON dataset
  return characterInfo[
    answerClassicDB.character_name.toLowerCase() as keyof typeof characterInfo
  ];
}

// Fetch the most recent voiceline answer from the database
async function getVoicelineAnswer() {
  const answerVoicelinesDB = await getAnswer("voicelines");

  // Retrieve the correct voiceline using character name and voiceline ID
  return voicelines[
    answerVoicelinesDB.character_name.toLowerCase() as keyof typeof voicelines
  ][answerVoicelinesDB.voiceline_id as keyof typeof voicelines.razor];
}

// Fetch the most recent abilities answer from the database
async function getAbilitiesAnswer() {
  const answerAbilitiesDB = await getAnswer("abilities");

  // Retrieve the correct ability using character name and ability type (burst/skill)
  return abilities[
    answerAbilitiesDB.character_name.toLowerCase() as keyof typeof abilities
  ][answerAbilitiesDB.ability_type as keyof typeof abilities.razor];
}

// Fetch the most recent spy mode answer from the database
async function getSpyAnswer() {
  const answerSpyDB = await getAnswer("spy");

  // Retrieve the corresponding character info from the JSON dataset
  return characterInfo[
    answerSpyDB.character_name.toLowerCase() as keyof typeof characterInfo
  ];
}

// API endpoint: Get answers for all game modes
export async function getAnswers(req: Request, res: Response) {
  res.send({
    classic: await getClassicAnswer(),
    voiceline: await getVoicelineAnswer(),
    ability: await getAbilitiesAnswer(),
    spy: await getSpyAnswer(),
  });
  return;
}

// API endpoint: Get an answer for a specific game mode
export function getAnswerGamemode(req: Request, res: Response) {
  const { gamemode } = req.params;

  switch (gamemode) {
    case "classic":
      getClassicAnswer().then((answer) => res.send(answer));
      return;
    case "voicelines":
      getVoicelineAnswer().then((answer) => res.send(answer));
      return;
    case "abilities":
      getAbilitiesAnswer().then((answer) => res.send(answer));
      return;
    case "spy":
      getSpyAnswer().then((answer) => res.send(answer));
      return;
  }

  // If an invalid gamemode is provided, return a 404 error
  res.statusCode = 404;
  throw new Error(
    "Invalid gamemode. Please use 'classic', 'voicelines', 'abilities', or 'spy'."
  );
  return;
}
