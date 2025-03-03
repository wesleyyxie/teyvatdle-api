// Table names as constants
const TABLES = {
  PAST_ANSWERS: "pastanswers",
  CLASSIC_HISTORY: "classichistory",
  ABILITIES_HISTORY: "abilitieshistory",
  VOICELINES_HISTORY: "voicelineshistory",
  SPY_HISTORY: "spyhistory",
};

// Helper functions to generate common query patterns
const generateDropTableQuery = (tableName: string) =>
  `DROP TABLE IF EXISTS ${tableName}`;
const generateSelectAllQuery = (tableName: string) =>
  `SELECT * FROM ${tableName}`;
const generateCountQuery = (tableName: string) =>
  `SELECT COUNT(*) FROM ${tableName}`;

// Grouped queries by table
export const PAST_ANSWERS = {
  DROP: generateDropTableQuery(TABLES.PAST_ANSWERS),
  CREATE: `
      CREATE TABLE IF NOT EXISTS ${TABLES.PAST_ANSWERS} (
        created_at DATETIME NOT NULL, 
        classic_name VARCHAR(30) NOT NULL, 
        ability_name VARCHAR(30) NOT NULL, 
        ability_type ENUM('burst', 'skill') NOT NULL, 
        voiceline_name VARCHAR(30) NOT NULL,  
        voiceline_id INT NOT NULL, 
        spy_name VARCHAR(30) NOT NULL
      )`,
};

export const CLASSIC = {
  DROP: generateDropTableQuery(TABLES.CLASSIC_HISTORY),
  CREATE: `
      CREATE TABLE IF NOT EXISTS ${TABLES.CLASSIC_HISTORY} (
        created_at DATETIME NOT NULL, 
        character_name VARCHAR(30) NOT NULL PRIMARY KEY
      )`,
  SELECT_COUNT: generateCountQuery(TABLES.CLASSIC_HISTORY),
  SELECT_ALL: generateSelectAllQuery(TABLES.CLASSIC_HISTORY),
  INSERT: `INSERT INTO ${TABLES.CLASSIC_HISTORY} (created_at, character_name) VALUES (?, ?)`,
};

export const ABILITIES = {
  DROP: generateDropTableQuery(TABLES.ABILITIES_HISTORY),
  CREATE: `
      CREATE TABLE IF NOT EXISTS ${TABLES.ABILITIES_HISTORY} (
        created_at DATETIME NOT NULL, 
        character_name VARCHAR(30) NOT NULL,    
        ability_type ENUM('burst', 'skill') NOT NULL,
        PRIMARY KEY (character_name, ability_type)
      )`,
  SELECT_COUNT: generateCountQuery(TABLES.ABILITIES_HISTORY),
  SELECT_ALL: generateSelectAllQuery(TABLES.ABILITIES_HISTORY),
  INSERT: `INSERT INTO ${TABLES.ABILITIES_HISTORY} (created_at, character_name, ability_type) VALUES (?, ?, ?)`,
};

export const VOICELINES = {
  DROP: generateDropTableQuery(TABLES.VOICELINES_HISTORY),
  CREATE: `
      CREATE TABLE IF NOT EXISTS ${TABLES.VOICELINES_HISTORY} (
        created_at DATETIME NOT NULL, 
        character_name VARCHAR(30) NOT NULL,
        voiceline_id INT NOT NULL,
        PRIMARY KEY (character_name, voiceline_id)
      )`,
  SELECT_COUNT: generateCountQuery(TABLES.VOICELINES_HISTORY),
  SELECT_ALL: generateSelectAllQuery(TABLES.VOICELINES_HISTORY),
  INSERT: `INSERT INTO ${TABLES.VOICELINES_HISTORY} (created_at, character_name, voiceline_id) VALUES (?, ?, ?)`,
};

export const SPY = {
  DROP: generateDropTableQuery(TABLES.SPY_HISTORY),
  CREATE: `
      CREATE TABLE IF NOT EXISTS ${TABLES.SPY_HISTORY} (
        created_at DATETIME NOT NULL, 
        character_name VARCHAR(30) NOT NULL PRIMARY KEY
      )`,
  SELECT_COUNT: generateCountQuery(TABLES.SPY_HISTORY),
  SELECT_ALL: generateSelectAllQuery(TABLES.SPY_HISTORY),
  INSERT: `INSERT INTO ${TABLES.SPY_HISTORY} (created_at, character_name) VALUES (?, ?)`,
};
