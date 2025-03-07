import cron from "node-cron";
import { updateAnswers } from "../database/updateHistories";

export function updateAnswerCron() {
  console.log("Setting up Cron Job");
  cron.schedule(
    "* * * * *",
    async () => {
      await updateAnswers();
    },
    {
      scheduled: true,
      timezone: "Africa/Abidjan",
    }
  );
}
