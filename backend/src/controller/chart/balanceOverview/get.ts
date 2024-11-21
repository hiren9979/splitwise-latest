import { Response } from "express";
import { getBalanceOverviewDB } from "../../../db/chart";
import { CustomRequest } from "../../../model/customRequest";

export default async function getBalanceOverviewChart(req: CustomRequest, res: Response) {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const month = parseInt(req.headers.month as string);
    const year = parseInt(req.headers.year as string);

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      res.status(400).json({ message: "Invalid month or year" });
      return;
    }

    const balance = await getBalanceOverviewDB(userId, month, year);
    res.status(200).json(balance);
  } catch (error) {
    console.error("Error in getBalanceOverview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};