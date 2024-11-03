import { Response } from "express";
import { sendResponse } from "../../../common/common";
import { addExpense } from "../../../db/expense";

export default async function registerUser(request: any, response: Response) {
  try {
    const data: any = {
      amount: parseFloat(request.body.amount),
      name: request.body.name,
      paidBy: request.body.paidBy,
      description: request.body.description,
      owedBy: request.body.owedBy,
      createdBy: request.body.createdBy,
    };

    const amount = data.amount;
    console.log(data);

    const info = await addExpense(data);
    console.log(data.owedBy);

    const owedByUsersList: string[] = data.owedBy.split(",");
    console.log("owedByUsersList:", owedByUsersList);

    for (let i = 0; i < owedByUsersList.length; i++) {
      data.owedBy = owedByUsersList[i];
      data.amount = amount / (owedByUsersList.length + 1);
      data.transactionId = info?.data?.expenseId; // Ensure expenseId is available
      console.log(data.transactionId);

      // const info1 = await addSplitExpense(data);
      // if (info1.status === 400) {
      //   res.send(responses.errorOccured(400, info1));
      //   return; // Exit the function to avoid sending multiple responses
      // }
    }

    // res.send(responses.successResponse(200, "Expense added successfully"));
  } catch (e: any) {
    return sendResponse(request, response, 400, { Message: e.message });
  }
}
