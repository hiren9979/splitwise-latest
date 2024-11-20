import { execute } from "../common/common";
import RESPONSES from "../common/response";
import { generateV4uuid } from "../common/util";

export async function addExpenseDetailDB(data: any): Promise<any> {
    try {
        const query = `INSERT INTO expenseDetail (id, paidBy, owedBy, amount, expenseId, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?);`;
        const result = await execute(query, [
            generateV4uuid(),
            data.paidBy,
            data.owedBy,
            data.amount,
            data.expenseId,
            data.createdBy,
            Date.now()
        ]);
        if (result) {
            return RESPONSES.success;
        } else {
            return RESPONSES.badRequest;
        }
    } catch (error) {
        return RESPONSES.tryAgain;
    }
}