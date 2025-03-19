import AppointmentAPI from "$root/controllers/Appointment.controller";
import { multipleImagesMiddleware } from "$root/middleware/upload";
import { auth, checkActive, isTherapistOrStaff } from "$root/middleware/auth";
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
  auth,
  checkActive,
  isTherapistOrStaff,
  multipleImagesMiddleware,
  AppointmentAPI.updateAppointment
);

export default router;
