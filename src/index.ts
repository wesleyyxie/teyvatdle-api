import express, { Express, Request, Response } from "express";

import { errorHandler } from "./middlewares/error.middlewares";

import charactersRouter from "./routes/characters";
import voicelinesRouter from "./routes/voicelines";
import abilitiesRouter from "./routes/abilities";
import splashRouter from "./routes/splash";
import answersRouter from "./routes/answers";

const app: Express = express();

app.use("/characters", charactersRouter);
app.use("/voicelines", voicelinesRouter);
app.use("/abilities", abilitiesRouter);
app.use("/splash", splashRouter);
app.use("/answers", answersRouter);
app.get("/", (req: Request, res: Response) => {
  res.send({
    categories: ["characters", "abilities", "voicelines", "splash"],
  });
});

app.get("/*", (req: Request, res: Response) => {
  res.statusCode = 404;
  throw new Error("Item not found");
});
app.use(errorHandler);

module.exports = app;
