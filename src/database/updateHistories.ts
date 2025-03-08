import abilities from "../../assets/data/abilities.json";
import characters from "../../assets/data/characterInfo.json";
import voicelines from "../../assets/data/voicelines.json";
import { CountRows } from "./models";
import {
  createClassicHistory,
  createAbilitiesHistory,
  createVoicelinesHistory,
  createSpyHistory,
} from "./manageTables";
import * as Queries from "./queries";
import { pool } from "./connection";

const historyTypes = {
  classic: {
    count: Object.keys(characters).length,
    countQuery: Queries.CLASSIC.SELECT_COUNT,
    selectQuery: Queries.CLASSIC.SELECT_ALL,
    insertQuery: Queries.CLASSIC.INSERT,
    createTable: createClassicHistory,
    dataSource: characters,
    getKey: (item: any) => item.name,
    getParams: (item: any) => [new Date(), item.name],
    idField: "character_name",
    parentIdField: "",
  },
  abilities: {
    count: Object.keys(abilities).length * 2,
    countQuery: Queries.ABILITIES.SELECT_COUNT,
    selectQuery: Queries.ABILITIES.SELECT_ALL,
    insertQuery: Queries.ABILITIES.INSERT,
    createTable: createAbilitiesHistory,
    dataSource: abilities,
    getKey: (item: any) => `${item.name}-${item.type}`,
    getParams: (item: any) => [new Date(), item.name, item.type],
    idField: "ability_type",
    parentIdField: "character_name",
  },
  voicelines: {
    count: Object.keys(voicelines).length * 4 - 1,
    countQuery: Queries.VOICELINES.SELECT_COUNT,
    selectQuery: Queries.VOICELINES.SELECT_ALL,
    insertQuery: Queries.VOICELINES.INSERT,
    createTable: createVoicelinesHistory,
    dataSource: voicelines,
    getKey: (item: any) => `${item.name}-${item.voicelineId}`,
    getParams: (item: any) => [
      new Date().toUTCString(),
      item.name,
      item.voicelineId,
    ],
    idField: "voiceline_id",
    parentIdField: "character_name",
  },
  spy: {
    count: Object.keys(characters).length,
    countQuery: Queries.SPY.SELECT_COUNT,
    selectQuery: Queries.SPY.SELECT_ALL,
    insertQuery: Queries.SPY.INSERT,
    createTable: createSpyHistory,
    dataSource: characters,
    getKey: (item: any) => item.name,
    getParams: (item: any) => [new Date(), item.name],
    idField: "character_name",
    parentIdField: "",
  },
};

function randomize(object: any) {
  const keys = Object.keys(object);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return object[randomKey as keyof typeof object];
}

async function addToHistory(historyType: keyof typeof historyTypes) {
  const config = historyTypes[historyType];

  // Get current count
  const [resultsCount] = await pool.query(config.countQuery);
  const count = resultsCount as CountRows[];
  const rowCount = count[0]["COUNT(*)"];

  // Reset history if all items have been used
  if (rowCount == config.count) {
    await config.createTable();
    console.log(`reseting ${historyType}`);
    return addToHistory(historyType);
  }

  // Get current history and build set of used items
  const [resultsRows] = await pool.query(config.selectQuery);
  const rows = resultsRows as any[];
  const itemsInHistory = new Set();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (config.parentIdField != "") {
      itemsInHistory.add(`${row[config.parentIdField]}-${row[config.idField]}`);
    } else {
      itemsInHistory.add(row[config.idField]);
    }
  }

  // Find an unused random item
  while (true) {
    let randomItem = randomize(config.dataSource);
    // For nested items like voicelines and abilities
    if (config.parentIdField != "") {
      randomItem = randomize(randomItem);
    }

    const key = config.getKey(randomItem);
    if (!itemsInHistory.has(key)) {
      await pool.query(config.insertQuery, config.getParams(randomItem));
      console.log(`added ${key}`);
      break;
    }
  }
}

async function updateClassicHistory() {
  return addToHistory("classic");
}

async function updateVoicelinesHistory() {
  return addToHistory("voicelines");
}

async function updateAbilitiesHistory() {
  return addToHistory("abilities");
}

async function updateSpyHistory() {
  return addToHistory("spy");
}

export async function updateAnswers() {
  console.log("updating answers");
  await updateClassicHistory();
  await updateAbilitiesHistory();
  await updateVoicelinesHistory();
  await updateSpyHistory();
  console.log("answers updated!");
}
