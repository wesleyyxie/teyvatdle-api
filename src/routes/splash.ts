import { Router } from "express";
import { getNames, getSplash, getSplashPixelated } from "../handlers/splash";

const router = Router();

router.get("/", getNames);
router.get("/:characterName", getSplash);
router.get("/:characterName/:pixelatedId", getSplashPixelated);

export default router;
