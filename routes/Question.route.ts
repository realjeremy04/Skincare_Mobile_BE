import QuestionAPI from "$root/controllers/Question.controller";
import { Router } from "express";

const router = Router();

router.get("/", QuestionAPI.getAllQuestion);
router.post("/", QuestionAPI.createQuestion);
router.get("/:id", QuestionAPI.getQuestion);
router.delete("/:id", QuestionAPI.deleteQuestion);
router.put("/:id", QuestionAPI.updateQuestion);

export default router;
