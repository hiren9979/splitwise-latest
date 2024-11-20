import { Response } from "express";
import { sendResponse } from "../../../common/common";
import { addExpenseDB } from "../../../db/expense";
import { addExpenseDetailDB } from "../../../db/expenseDetail";

export default async function expenseUnequally(request: any, response: Response) {
  try {
    const data: any = {
      amount: parseFloat(request.body.totalExpense),
      paidBy: request.user.userId,
      unEqualExpense: request.body.unEqualExpense,
      notes: request.body.description,
      createdBy: request.user.userId,
    };

    data.owedBy = data.unEqualExpense.map((user: any) => user.id).join(",");
    const info = await addExpenseDB(data);

    if (info.status === 200) {
      for (let i = 0; i < data.unEqualExpense.length; i++) {
        const expenseDetailData = {
          paidBy: data.paidBy,
          owedBy: data.unEqualExpense[i].id,
          amount: data.unEqualExpense[i].expense,
          expenseId: info.data.expenseId,
          createdBy: data.createdBy
        }
        const info1 = await addExpenseDetailDB(expenseDetailData);
        if (info1.statusCode !== 200) {
          return sendResponse(request, response, info1.statusCode, info1.clientMessage);
        }
      }
    }

    return sendResponse(request, response, info.statusCode, info.clientMessage);
  } catch (e: any) {
    return sendResponse(request, response, 400, { Message: e.message });
  }
}
