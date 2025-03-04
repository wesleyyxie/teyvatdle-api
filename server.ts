import { Express } from "express";

const app: Express = require("./src");
const port = 3000;

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}/`);
});
