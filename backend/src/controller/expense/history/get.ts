import { Response } from "express";
import { sendResponse } from "../../../common/common";
import { getExpenseHistoryDB } from "../../../db/expense";
import { CustomRequest } from "../../../model/customRequest";


export default async function expenseHistory(request: CustomRequest, response: Response) {
  try {
    const userData = {
      otherUserId: request.headers.otheruserid,
      paidBy: request.user.userId,
    };
    const info = await getExpenseHistoryDB(userData);
    return sendResponse(request, response, 200, info);
  } catch (e: any) {
    return sendResponse(request, response, 400, { Message: e.message });
  }
}
