import express from "express";
import { commentRoutes } from "../api/comment/index.ts";

const router = express.Router();

router.use("/comment", commentRoutes);

export { router };
