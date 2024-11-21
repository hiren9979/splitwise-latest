import { execute } from "../common/common";
import { generateV4uuid } from "../common/util";
import { Expense } from "../model/expense";

export async function addExpenseDB(data: Expense): Promise<any> {
  try {
    console.log("adding expense");
    const query = `INSERT INTO expense (id, amount, paidBy, owedBy, title, date, categoryId, notes, createdBy, createdAt)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const expenseId = generateV4uuid();
    console.log(expenseId);
    const result = await execute(query, [
      expenseId,
      data.amount,
      data.paidBy,
      data.owedBy,
      data.title,
      data.date,
      data.categoryId,
      data.notes,
      data.paidBy,
      Date.now()
    ]);
    console.log("result: " + result);
    if (result && result.affectedRows > 0) {
      console.log("Expense added successfully.");
      return {
        statusCode: 200,
        clientMessage: "Successfully added expense",
        data: { expenseId },
      };
    } else {
      console.error("Failed to add expense.");
      return { statusCode: 400, clientMessage: "Failed to add expense" };
    }
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
}

export async function getExpenseHistoryDB(data: any) {
  try {
    console.log("Getting expense history");
    const query = `SELECT ed.id,ed.amount
                      ,JSON_OBJECT(
                          'id', u.id,
                          'name', u.name,
                          'email', u.email
                      ) as paidBy,
                      JSON_OBJECT(
                          'id', u1.id,
                          'name', u1.name,
                          'email', u1.email
                      ) as owedBy,
                      JSON_OBJECT(
                          'id', e.id,
                          'amount', e.amount,
                          'balance', CASE 
                               WHEN ed.paidBy = ? THEN ed.amount
                               WHEN ed.paidBy = ? THEN -ed.amount
                           END,                
                          'notes', e.notes,
                          'title', e.title,
                          'date', e.date,
                          'category', (
                              SELECT name FROM category c WHERE c.id = e.categoryId AND c.isDeleted = false
                          ),
                          'paidBy', e.paidBy,
                          'owedBy', e.owedBy,
                          'createdAt', e.createdAt,
                          'user', (
                              SELECT JSON_ARRAYAGG(
                                  JSON_OBJECT(
                                      'id', u.id,
                                      'name', u.name,
                                      'email', u.email
                                  )
                              ) FROM users u WHERE FIND_IN_SET(u.id, e.owedBy) > 0
                          )
                      ) as expense 
                      FROM expenseDetail ed
                      LEFT JOIN expense e ON e.id = ed.expenseId
                      LEFT JOIN users u ON u.id = ed.paidBy
                      LEFT JOIN users u1 ON u1.id = ed.owedBy
                      WHERE (ed.owedBy = ? AND ed.paidBy = ?) 
                        OR (ed.owedBy = ? AND ed.paidBy = ?)
                      ORDER BY e.createdAt DESC`;                
    const params = [
      data.paidBy, data.otherUserId,  // For totalAmounts subquery CASE
      data.otherUserId, data.paidBy, data.paidBy, data.otherUserId   // For main WHERE clause
    ];
    
    const result = await execute(query, params);
    const newResult = result.map((item: any) => ({
      ...item,
      expense: item.expense ? JSON.parse(item.expense) : item.expense,
      paidBy: item.paidBy ? JSON.parse(item.paidBy) : item.paidBy,
      owedBy: item.owedBy ? JSON.parse(item.owedBy) : item.owedBy
    }));

    // Calculate total balance
    const totalBalance = newResult.reduce((sum: number, item: any) => {
      return sum + (item.expense.balance || 0);
    }, 0);

    return {
      transactions: newResult,
      balance: totalBalance
    };

  } catch (error) {
    console.error("Error in getExpenseHistoryDB:", error);
    return {
      transactions: [],
      totalBalance: 0
    };
  }
}