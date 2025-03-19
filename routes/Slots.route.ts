import SlotsAPI from "$root/controllers/Slots.controller";
import { Router } from "express";

const router = Router();

router.get("/", SlotsAPI.getAllSlots);
router.post("/", SlotsAPI.createSlot);
router.get("/:slotId", SlotsAPI.getSlot);
router.delete("/:slotId", SlotsAPI.deleteSlot);
router.put("/:slotId", SlotsAPI.updateSlot);

export default router;
