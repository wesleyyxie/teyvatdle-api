import * as Queries from "./queries";
import { pool } from "./connection";

const gamemodeQueries = {
  classic: {
    selectQuery: Queries.CLASSIC.SELECT_ALL,
  },
  abilities: {
    selectQuery: Queries.ABILITIES.SELECT_ALL,
  },
  voicelines: {
    selectQuery: Queries.VOICELINES.SELECT_ALL,
  },
  spy: {
    selectQuery: Queries.SPY.SELECT_ALL,
  },
} as const;

export async function getAnswer(gamemode: keyof typeof gamemodeQueries) {
  try {
    // Get the corresponding SQL query for the requested gamemode
    const config = gamemodeQueries[gamemode];

    // Execute the query
    const [results] = await pool.query(config.selectQuery);

    // Ensure results are properly typed
    const rows = results as any[];

    // Return the latest entry or `null` if no data is found
    return rows.length > 0 ? rows[rows.length - 1] : null;
  } catch (error) {
    console.error(`❌ Error fetching data for gamemode "${gamemode}":`, error);
    throw new Error("Database query failed");
  }
}
