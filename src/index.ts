import express, { Express, Request, Response } from "express";

// Import custom error handling middleware
import { errorHandler } from "./middlewares/error.middlewares";

// Import route handlers for different resources
import charactersRouter from "./routes/characters";
import voicelinesRouter from "./routes/voicelines";
import abilitiesRouter from "./routes/abilities";
import splashRouter from "./routes/splash";
import answersRouter from "./routes/answers";

// Create Express application instance
const app: Express = express();

// Mount resource-specific routers
// Each router handles requests to its specific endpoint
app.use("/characters", charactersRouter);
app.use("/voicelines", voicelinesRouter);
app.use("/abilities", abilitiesRouter);
app.use("/splash", splashRouter);
app.use("/answers", answersRouter);

// Root endpoint - provides an overview of available API categories
app.get("/", (req: Request, res: Response) => {
  res.json({
    categories: ["characters", "abilities", "voicelines", "splash"],
  });
});

// Catch-all route for handling undefined routes
// This middleware will trigger a 404 error for any unmatched routes
app.get("/*", (req: Request, res: Response) => {
  res.status(404);
  throw new Error("Resource not found");
});

// Apply global error handling middleware
// This will catch and process any errors thrown in the application
app.use(errorHandler);

// Export the configured Express application
module.exports = app;
