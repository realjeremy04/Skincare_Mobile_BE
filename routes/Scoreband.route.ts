import ScorebandAPI from "$root/controllers/Scoreband.controller";
import { Router } from "express";

const router = Router();

router.get("/", ScorebandAPI.getAllScoreband);
router.post("/", ScorebandAPI.createScoreband);
router.get("/:id", ScorebandAPI.getScoreband);
router.delete("/:id", ScorebandAPI.deleteScoreband);
router.put("/:id", ScorebandAPI.updateScoreband);

export default router;
