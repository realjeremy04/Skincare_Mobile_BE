import express from "express";
import TherapistAPI from "$controllers/Therapist.controller";

import { validateRequest } from "$root/middleware/validateRequest";
import { therapistIdValidation, therapistValidation, serviceIdValidation } from "$root/validators/therapist.validator";
import { auth, authWithCookies, checkActive, isAdmin } from "$root/middleware/auth";


const router = express.Router();

router.get("/", TherapistAPI.getAllTherapists);
router.get("/:therapistId", therapistIdValidation, validateRequest, TherapistAPI.getTherapist);
router.post("/", authWithCookies, checkActive, isAdmin, therapistValidation, validateRequest, TherapistAPI.createTherapist);
router.get("/by-service/:serviceId", serviceIdValidation, validateRequest, TherapistAPI.getTherapistsByServiceId);
router.put("/:therapistId", authWithCookies, checkActive, isAdmin, therapistIdValidation, therapistValidation, validateRequest, TherapistAPI.updateTherapist);
router.delete("/:therapistId", authWithCookies, checkActive, isAdmin, therapistIdValidation, validateRequest, TherapistAPI.deleteTherapist);

export default router;
