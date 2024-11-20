import { execute } from "../common/common";

export async function getExpenseByCategoryDB(id: any) {
  const query = `SELECT 
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', id,
                            'name', name,
                            'spend', spend
                        )
                    ) AS categories
                FROM (
                    SELECT 
                        c.id AS id,
                        COALESCE(c.name, 'other') AS name,
                        SUM(e.amount) AS spend
                    FROM 
                        expense e
                    LEFT JOIN 
                        category c ON c.id = e.categoryId
                    WHERE e.paidBy = ?
                    GROUP BY 
                        c.id, c.name
                ) subquery;   `;
  const info = await execute(query, [id]);
  
  // Parse the JSON string from the result
  if (info && info[0] && info[0].categories) {
    return JSON.parse(info[0].categories);
  }
  return []; // Return empty array if no data found
}

export async function getExpenseByMonthDB(id: any) {
  const query = `SELECT 
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'month', month,
                            'spend', COALESCE(spend, 0)
                        )
                    ) AS months
                FROM (
                    SELECT 
                        m.month,
                        SUM(e.amount) as spend
                    FROM (
                        SELECT MONTH(DATE_SUB(CURDATE(), INTERVAL n MONTH)) as month
                        FROM (
                            SELECT 0 as n UNION SELECT 1 UNION SELECT 2 
                            UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
                        ) months
                    ) m
                    LEFT JOIN expense e ON 
                        MONTH(e.date) = m.month 
                        AND YEAR(e.date) = YEAR(CURDATE())
                        AND e.paidBy = ?
                    GROUP BY m.month
                    ORDER BY m.month DESC
                ) subquery;`;
                
  const info = await execute(query, [id]);
  
  if (info && info[0] && info[0].months) {
    return JSON.parse(info[0].months);
  }
  return []; 
}
