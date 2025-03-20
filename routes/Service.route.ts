import { auth, authWithCookies, checkActive, isStaffOrAdmin } from "$root/middleware/auth";
import ServiceAPI from "../controllers/Service.controller";
import { Router } from "express";

const router = Router();

router.get("/", ServiceAPI.getAllServices);
router.post("/", authWithCookies, checkActive, isStaffOrAdmin, ServiceAPI.createService);
router.get("/:serviceId", ServiceAPI.getService);
router.delete("/:serviceId", ServiceAPI.deleteService);
router.put("/:serviceId", ServiceAPI.updateService);

export default router;
