import { Router } from "express";
import {
  getCharacters,
  getCharacterByName,
  getCharacterIcon,
} from "../handlers/characters";

const router = Router();

router.get("/", getCharacters);
router.get("/:characterName", getCharacterByName);
router.get("/:characterName/:icon", getCharacterIcon);

export default router;
