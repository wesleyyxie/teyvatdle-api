import * as Queries from "./queries";
import { pool } from "./connection";

export async function dropClassicHistory() {
  const [selectResult] = await pool.query(Queries.CLASSIC.DROP);
}

export async function dropAbilitiesHistory() {
  const [selectResult] = await pool.query(Queries.ABILITIES.DROP);
}

export async function dropVoicelinesHistory() {
  const [selectResult] = await pool.query(Queries.VOICELINES.DROP);
}
export async function dropSpyHistory() {
  const [selectResult] = await pool.query(Queries.SPY.DROP);
}

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
  console.log("Created tables!");
}

async function dropTables() {
  await dropClassicHistory();
  await dropAbilitiesHistory();
  await dropVoicelinesHistory();
  await dropSpyHistory();
  console.log("Dropped tables!");
}

async function dropThenCreate() {
  await dropTables();
  await initalizeTables();
}

initalizeTables();
process.exit();
