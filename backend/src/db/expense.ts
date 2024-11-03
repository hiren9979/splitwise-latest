import { execute } from "../common/common.js";
import responses from "../common/response.js";
import { generateV4uuid } from "../common/util.js";

interface AddExpenseData {
  amount: number;
  name: string;
  paidBy: string;
  owedBy: string[];
  description: string;
}


export async function addExpense(data: AddExpenseData): Promise<any> {
  try {
    const userList = data.owedBy.join(",");
    console.log(userList);
    console.log("adding expense");
    const query = `INSERT INTO expense (id, amount, name, paidBy, owedBy, notes, createdBy)
                   VALUES (?, ?, ?, ?, ?, ?, ?);`;
    const expenseId = generateV4uuid();
    console.log(expenseId);
    const result = await execute(query, [
      expenseId,
      data.amount,
      data.name,
      data.paidBy,
      userList,
      data.description,
      "f",
    ]); 
    console.log("result: " + result);
    if (result && result.affectedRows > 0) {
      console.log("Expense added successfully.");
      return {
        status: 200,
        message: "Successfully added expense",
        data: { expenseId },
      };
    } else {
      console.error("Failed to add expense.");
      return { status: 400, message: "Failed to add expense" };
    }
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error; 
  } 
}

export async function addSplitExpense(data: any): Promise<any> {
  try {
    const query = `INSERT INTO splitexpense (id, paidBy, owedBy, amount, transactionId, createdBy) VALUES (?, ?, ?, ?, ?, ?);`;
    const result = await execute(query, [
      generateV4uuid(),
      data.paidBy,
      data.owedBy,
      data.amount,
      data.transactionId,
      data.createdBy,
    ]);
    if (result) {
      return result;
    } else {
      return responses.badRequest;
    }
  } catch (error) {
    return responses.tryAgain;
  }
}
