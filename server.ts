import { Express } from "express";
import { updateAnswerCron } from "./src/tasks/updateAnswerTask";

const app: Express = require("./src");
const port = 3000;

updateAnswerCron();
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}/`);
});
