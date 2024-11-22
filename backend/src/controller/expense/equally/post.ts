import { Response } from "express";
import { addExpenseDB } from "../../../db/expense";
import { sendResponse } from "../../../common/common";
import { addExpenseDetailDB } from "../../../db/expenseDetail";
import { CustomRequest } from "../../../model/customRequest";

export default async function expenseEqually(request: CustomRequest, response: Response) {
  try {
    const data: any = {
      amount: parseFloat(request.body.totalExpense),
      title: request.body.title,
      paidBy: request.user.userId,
      date: request.body.date,
      notes: request.body.notes,
      categoryId: request.body.categoryId,
      owedBy: request.body.owedBy,
      createdBy: request.user.userId,
    };

    const amount = data.amount;
    if (!data.date) {
      data.date = Date.now();
    }
    data.owedBy = data.owedBy.map((user: any) => user.id).join(",");

    const info = await addExpenseDB(data);

    const owedByUsersList: string[] = data.owedBy.split(",");

    for (let i = 0; i < owedByUsersList.length; i++) {
      data.owedBy = owedByUsersList[i];
      data.amount = amount / (owedByUsersList.length + 1);
      data.expenseId = info?.data?.expenseId;
      console.log(data.transactionId);

      const info1 = await addExpenseDetailDB(data);
      if (info1.status === 400) {
        return sendResponse(request, response, info1.statusCode, info1.clientMessage);
      }
    }

    return sendResponse(request, response, 200, "Expense Added Successfully");
  } catch (e: any) {
    return sendResponse(request, response, 400, { Message: e.message });
  }
}
