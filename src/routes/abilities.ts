import { Router } from "express";
import {
  getAbilities,
  getAbilitiesByName,
  getAbilityByType,
  getAbilityIcon,
} from "../handlers/abilities";

// Create a new Express router instance
const router = Router();

// Route to retrieve all abilities
router.get("/", getAbilities);

// Route to retrieve abilities for a specific character
// URL pattern: /abilities/:characterName
router.get("/:characterName", getAbilitiesByName);

// Route to retrieve a specific ability type for a character
// URL pattern: /abilities/:characterName/:type
router.get("/:characterName/:type", getAbilityByType);

// Route to retrieve an ability icon for a specific character and ability type
// URL pattern: /abilities/:characterName/:type/:icon
router.get("/:characterName/:type/:icon", getAbilityIcon);

export default router;
