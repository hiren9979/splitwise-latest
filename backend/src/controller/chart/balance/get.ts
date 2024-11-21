import { Request, Response } from "express";
import { getIndividualBalanceDB } from "../../../db/chart";

export const getIndividualBalance = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const balances = await getIndividualBalanceDB(userId);
    return res.status(200).json({ balances });
  } catch (error) {
    console.error("Error in getIndividualBalance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}; 