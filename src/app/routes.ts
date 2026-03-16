import express from "express";
import { commentRoutes } from "../api/comment/index.ts";
import { postRoutes } from "../api/post/index.ts";

const router = express.Router();

router.use("/comments", commentRoutes);
router.use("/posts", postRoutes);

export { router };
