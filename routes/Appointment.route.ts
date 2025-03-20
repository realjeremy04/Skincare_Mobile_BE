import AppointmentAPI from "$root/controllers/Appointment.controller";
import { multipleImagesMiddleware } from "$root/middleware/upload";
import {
  auth,
  authWithCookies,
  checkActive,
  isTherapist,
  isTherapistOrStaff,
} from "$root/middleware/auth";
import { Router } from "express";

const router = Router();

router.get("/", AppointmentAPI.getAllAppointment);
router.post("/", auth, checkActive, AppointmentAPI.createAppointment);
router.get("/:id", AppointmentAPI.getAppointment);
router.get("/customer/:customerId", AppointmentAPI.getAppointmentsByCustomerId);
router.get("/account/:accountId", AppointmentAPI.getAppointmentsByAccountId);
router.delete("/:id", AppointmentAPI.deleteAppointment);
router.patch(
  "/:id",
  authWithCookies,
  checkActive,
  isTherapistOrStaff,
  multipleImagesMiddleware,
  AppointmentAPI.updateAppointment
);

router.patch(
  "/JWT/:id",
  auth,
  checkActive,
  isTherapist,
  multipleImagesMiddleware,
  AppointmentAPI.updateAppointment
);

export default router;
