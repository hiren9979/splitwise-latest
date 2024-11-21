import express from "express";
import authMiddleware from "../../middleware/auth";
import getExpenseByCategoryChart from "../../controller/chart/byCategory/get";
import getExpenseByMonthChart from "../../controller/chart/monthlySpend/get";
import getIndividualBalanceChart from "../../controller/chart/individualBalance/get";
import getBalanceOverviewChart from "../../controller/chart/balanceOverview/get";

const router = express.Router();

router.get("/byCategory", authMiddleware, getExpenseByCategoryChart);
router.get("/byMonth", authMiddleware, getExpenseByMonthChart);
router.get("/individualBalance", authMiddleware, getIndividualBalanceChart);
router.get("/balanceOverview", authMiddleware, getBalanceOverviewChart);
export default router; 