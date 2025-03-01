import { Router } from "express";
import {
  getVoicelines,
  getVoicelinesByName,
  getVoicelinesByNameAndId,
  getAudio,
} from "../handlers/voicelines";

const router = Router();

router.get("/", getVoicelines);
router.get("/:characterName", getVoicelinesByName);
router.get("/:characterName/:id", getVoicelinesByNameAndId);
router.get("/:characterName/:id/:audio", getAudio);

export default router;
