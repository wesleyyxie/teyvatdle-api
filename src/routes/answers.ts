import { Router } from "express";
import { getAnswers, getAnswerGamemode } from "../handlers/answers";

// Create a new Express router instance
const router = Router();

// Route to retrieve all available answers
router.get("/", getAnswers);

// Route to retrieve answers for a specific gamemode
// URL pattern: /answers/:gamemode
router.get("/:gamemode", getAnswerGamemode);

export default router;
