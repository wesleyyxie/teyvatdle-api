import { profileEnd } from "console";
import { updateAnswers } from "./updateHistories";

console.log(process.env["FIREBASE_PASSWORD"]);
async function updateAnswersRun() {
  await updateAnswers();
  process.exit();
}

updateAnswersRun();
