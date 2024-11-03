import { Router } from "express";
import register from "./register";
import login from "./login";
import user from "./user";

export const router = Router();

router.use("/register", register);
router.use("/login", login);
router.use("/users", user);
