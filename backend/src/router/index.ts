import { Router } from "express";
import register from "./register";
import login from "./login";
import user from "./user";
import expense from "./expense";
import category from "./category";
import authMiddleware from "../middleware/auth";
import chart from "./chart";

export const router = Router();

router.use("/register", register);
router.use("/login", login);
router.use("/users", authMiddleware, user);
router.use("/expense", expense);
router.use("/category", category);
router.use("/chart", chart);
