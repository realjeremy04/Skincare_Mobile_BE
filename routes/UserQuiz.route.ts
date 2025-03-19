import UserQuizAPI from "$root/controllers/UserQuiz.controller";
import { Router } from "express";

const router = Router();

router.get("/", UserQuizAPI.getAllUserQuizzes);
router.post("/", UserQuizAPI.createUserQuiz);
router.get("/:userQuizId", UserQuizAPI.getUserQuiz);
router.delete("/:userQuizId", UserQuizAPI.deleteUserQuiz);
router.put("/:userQuizId", UserQuizAPI.updateUserQuiz);

export default router;
