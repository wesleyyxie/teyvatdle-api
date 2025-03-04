import { Router } from "express";
import {
  getCharacters,
  getCharacterByName,
  getCharacterIcon,
} from "../handlers/characters";

// Create a new Express router instance
const router = Router();

// Route to retrieve all characters
router.get("/", getCharacters);

// Route to retrieve details for a specific character
// URL pattern: /characters/:characterName
router.get("/:characterName", getCharacterByName);

// Route to retrieve an icon for a specific character
// URL pattern: /characters/:characterName/:icon
router.get("/:characterName/:icon", getCharacterIcon);

export default router;
