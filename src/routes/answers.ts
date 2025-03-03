import { Router } from "express";
import { getAnswers, getAnswerGamemode } from "../handlers/answers";

const router = Router();

router.get("/", getAnswers);
router.get("/:gamemode", getAnswerGamemode);

export default router;
