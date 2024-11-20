import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import getExpenseByCategoryChart from "../../controller/chart/byCategory/get";
import getExpenseByMonthChart from "../../controller/chart/monthlySpend/get";

const router = Router();

router.get("/byCategory", authMiddleware, getExpenseByCategoryChart);
router.get("/byMonth", authMiddleware, getExpenseByMonthChart);

export default router; 