import { Router } from "express";
import registerUser from "../../controller/register/post";

const router = Router();

router.post("", registerUser);


export default router;
