import { Router } from "express";
import expenseEqually from "../../controller/expense/equally/post";
import expenseUnequally from "../../controller/expense/unequally/post";
import authMiddleware from "../../middleware/auth";
import expenseHistory from "../../controller/expense/history/get";

const router = Router();

router.post("/equally", authMiddleware, expenseEqually);
router.post("/unequally", authMiddleware, expenseUnequally); // This route does not have authentication
router.get("/history", authMiddleware, expenseHistory);

export default router;
