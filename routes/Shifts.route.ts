import ShiftsAPI from "$root/controllers/Shifts.controller";
import {
  auth,
  checkActive,
  isStaffOrAdmin,
  isTherapist,
} from "$root/middleware/auth";
import { Router } from "express";

const router = Router();

router.get("/", ShiftsAPI.getAllShifts);
router.post("/", auth, checkActive, isStaffOrAdmin, ShiftsAPI.createShift);
router.get("/:shiftId", ShiftsAPI.getShift);
router.get("/therapist/:therapistId", ShiftsAPI.getShiftsByTherapistId);
router.get(
  "/therapist/upcoming/:therapistId",
  ShiftsAPI.getUpcomingShiftsByTherapistId
);
router.get(
  "/account/upcoming/:accountId",
  auth,
  checkActive,
  isTherapist,
  ShiftsAPI.getUpcomingShiftsByAccountId
);
router.delete(
  "/:shiftId",
  auth,
  checkActive,
  isStaffOrAdmin,
  ShiftsAPI.deleteShift
);
router.put(
  "/:shiftId",
  auth,
  checkActive,
  isStaffOrAdmin,
  ShiftsAPI.updateShift
);

export default router;
