import { Router } from "express";
import {
  getVoicelines,
  getVoicelinesByName,
  getVoicelinesByNameAndId,
  getAudio,
} from "../handlers/voicelines";

// Create a new Express router instance
const router = Router();

// Route to retrieve all voicelines
router.get("/", getVoicelines);

// Route to retrieve voicelines for a specific character
// URL pattern: /voicelines/:characterName
router.get("/:characterName", getVoicelinesByName);

// Route to retrieve a specific voiceline for a character
// URL pattern: /voicelines/:characterName/:id
router.get("/:characterName/:id", getVoicelinesByNameAndId);

// Route to retrieve audio for a specific voiceline
// URL pattern: /voicelines/:characterName/:id/:audio
router.get("/:characterName/:id/:audio", getAudio);

export default router;
