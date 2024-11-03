import { Router } from "express";
import getUsers from "../../controller/user/get";

const router = Router();

router.get("", getUsers);

export default router;
