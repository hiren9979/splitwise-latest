import { Request, Response } from "express";
import { getIndividualBalanceDB } from "../../../db/chart";
import { CustomRequest } from "../../../model/customRequest";

export const getIndividualBalance = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
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