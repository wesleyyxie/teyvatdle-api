import { Router } from "express";
import {
  getAbilities,
  getAbilitiesByName,
  getAbilityByType,
  getAbilityIcon,
} from "../handlers/abilities";

const router = Router();

router.get("/", getAbilities);
router.get("/:characterName", getAbilitiesByName);
router.get("/:characterName/:type", getAbilityByType);
router.get("/:characterName/:type/:icon", getAbilityIcon);

export default router;
