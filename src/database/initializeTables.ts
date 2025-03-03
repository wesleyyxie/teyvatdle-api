import * as Queries from "./queries";
import { pool } from "./connection";
import { initializeApp } from "firebase/app";

export async function createClassicHistory() {
  const [selectResult] = await pool.query(Queries.CLASSIC.CREATE);
}

export async function createAbilitiesHistory() {
  const [selectResult] = await pool.query(Queries.ABILITIES.CREATE);
}

export async function createVoicelinesHistory() {
  const [selectResult] = await pool.query(Queries.VOICELINES.CREATE);
}
export async function createSpyHistory() {
  const [selectResult] = await pool.query(Queries.SPY.CREATE);
}

async function initalizeTables() {
  await createClassicHistory();
  await createAbilitiesHistory();
  await createVoicelinesHistory();
  await createSpyHistory();
}

initalizeTables();
