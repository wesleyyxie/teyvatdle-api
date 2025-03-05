import * as Queries from "./queries";
import { pool } from "./connection";

// Drop table functions
export async function dropClassicHistory() {
  await pool.query(Queries.CLASSIC.DROP);
}

export async function dropAbilitiesHistory() {
  await pool.query(Queries.ABILITIES.DROP);
}

export async function dropVoicelinesHistory() {
  await pool.query(Queries.VOICELINES.DROP);
}

export async function dropSpyHistory() {
  await pool.query(Queries.SPY.DROP);
}

// Create table functions
export async function createClassicHistory() {
  await pool.query(Queries.CLASSIC.CREATE);
}

export async function createAbilitiesHistory() {
  await pool.query(Queries.ABILITIES.CREATE);
}

export async function createVoicelinesHistory() {
  await pool.query(Queries.VOICELINES.CREATE);
}

export async function createSpyHistory() {
  await pool.query(Queries.SPY.CREATE);
}

// Initialize tables
export async function initializeTables() {
  await createClassicHistory();
  await createAbilitiesHistory();
  await createVoicelinesHistory();
  await createSpyHistory();
  console.log("✅ Tables created successfully!");
}

// Drop tables
async function dropTables() {
  await dropClassicHistory();
  await dropAbilitiesHistory();
  await dropVoicelinesHistory();
  await dropSpyHistory();
  console.log("🗑️ Tables dropped successfully!");
}

// Reset tables (drop and recreate)
async function resetTables() {
  await dropTables();
  await initializeTables();
}
