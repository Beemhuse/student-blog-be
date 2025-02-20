import express from "express";
import { createPost, deletePost, getAllPosts, getPostBySlug, updatePost } from "../controllers/postControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";


const router = express.Router();

// Blog post routes
router.get("/", getAllPosts);
router.get("/:slug", getPostBySlug);
// Protected Routes (Require Authentication)
router.post("/", verifyToken, createPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;
