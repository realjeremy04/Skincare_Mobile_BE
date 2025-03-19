import { Router } from "express";
import accountRoutes from "./Account.route";
import serviceRoutes from "./Service.route";
import appointmentRoutes from "./Appointment.route";
import blogRoutes from "./Blog.route";
import feedbackRoutes from "./Feedback.route";
import shiftsRoutes from "./Shifts.route";
import questionRoutes from "./Question.route";
import scorebandRoutes from "./Scoreband.route";
import slotsRoutes from "./Slots.route";
import therapistRoutes from "./Therapist.route";
import transactionRoutes from "./Transaction.route";
import userQuizRoutes from "./UserQuiz.route";
import RoadmapRoutes from "./Roadmap.route";

const router = Router();

router.use("/account", accountRoutes);
router.use("/service", serviceRoutes);
router.use("/appointment", appointmentRoutes);
router.use("/blog", blogRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/shifts", shiftsRoutes);
router.use("/question", questionRoutes);
router.use("/scoreband", scorebandRoutes);
router.use("/slots", slotsRoutes);
router.use("/therapist", therapistRoutes);

router.use("/transaction", transactionRoutes);
router.use("/userQuiz", userQuizRoutes);
router.use("/roadmap", RoadmapRoutes);

export default router;
