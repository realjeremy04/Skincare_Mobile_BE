import RoadmapAPI from "$root/controllers/Roadmap.controller";
import { Router } from "express";

const router = Router();

router.get("/", RoadmapAPI.getAllRoadmap);
router.post("/", RoadmapAPI.createRoadmap);
router.get("/:id", RoadmapAPI.getRoadmap);
router.delete("/:id", RoadmapAPI.deleteRoadmap);
router.put("/:id", RoadmapAPI.updateRoadmap);

export default router;
