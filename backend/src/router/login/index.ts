import { Router } from "express";
import loginUser from "../../controller/login/get";

const router = Router();

router.get("", loginUser);

export default router;
