import express from "express";
import { commentRoutes } from "../api/comment/index.ts";
import { postRoutes } from "../api/post/index.ts";

const router = express.Router();

router.use("/comment", commentRoutes);
router.use("/post", postRoutes);

export { router };
