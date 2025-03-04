import { Router } from "express";
import { getNames, getSplash, getSplashPixelated } from "../handlers/splash";

// Create a new Express router instance
const router = Router();

// Route to retrieve all splash art names
router.get("/", getNames);

// Route to retrieve splash art for a specific character
// URL pattern: /splash/:characterName
router.get("/:characterName", getSplash);

// Route to retrieve pixelated splash art for a specific character
// URL pattern: /splash/:characterName/:pixelatedId
router.get("/:characterName/:pixelatedId", getSplashPixelated);

export default router;
