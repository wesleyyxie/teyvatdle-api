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
};
export async function getAnswer(gamemode: keyof typeof gamemodeQueries) {
  const config = gamemodeQueries[gamemode];
  const [results] = await pool.query(config.selectQuery);
  const rows = results as any[];
  return rows[rows.length - 1];
}
