import { Request, Response } from "express";
import { getAnswer } from "../database/answers";
import characterInfo from "../../assets/data/characterInfo.json";
import abilities from "../../assets/data/abilities.json";
import voicelines from "../../assets/data/voicelines.json";

async function getClassicAnswer() {
  const answerClassicDB = await getAnswer("classic");
  return characterInfo[
    answerClassicDB.character_name.toLowerCase() as keyof typeof characterInfo
  ];
}

async function getVoicelineAnswer() {
  const answerVoicelinesDB = await getAnswer("voicelines");
  return voicelines[
    answerVoicelinesDB.character_name.toLowerCase() as keyof typeof voicelines
  ][answerVoicelinesDB.voiceline_id as keyof typeof voicelines.razor];
}

async function getAbilitiesAnswer() {
  const answerAbilitiesDB = await getAnswer("abilities");
  return abilities[
    answerAbilitiesDB.character_name.toLowerCase() as keyof typeof abilities
  ][answerAbilitiesDB.ability_type as keyof typeof abilities.razor];
}

async function getSpyAnswer() {
  const answerSpyDB = await getAnswer("spy");
  return characterInfo[
    answerSpyDB.character_name.toLowerCase() as keyof typeof characterInfo
  ];
}

export async function getAnswers(req: Request, res: Response) {
  res.send({
    classic: await getClassicAnswer(),
    voiceline: await getVoicelineAnswer(),
    ability: await getAbilitiesAnswer(),
    spy: await getSpyAnswer(),
  });
  return;
}

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
  throw new Error(
    "Invalid gamemode. Please use 'classic', 'voicelines', 'abilities', or 'spy'."
  );
  return;
}
