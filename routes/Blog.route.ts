import BlogAPI from "$root/controllers/Blog.controller";
import { auth, checkActive, isStaffOrAdmin } from "$root/middleware/auth";
import { Router } from "express";

const router = Router();

router.get("/", BlogAPI.getAllBlog);
router.post("/", auth, checkActive, isStaffOrAdmin, BlogAPI.createBlog);
router.get("/:id", BlogAPI.getBlog);
router.delete("/:id", auth, checkActive, isStaffOrAdmin, BlogAPI.deleteBlog);
router.put("/:id", auth, checkActive, isStaffOrAdmin, BlogAPI.updateBlog);

export default router;
