import { execute } from "../common/common";

export async function getExpenseByCategoryDB(id: any) {
  const query = `SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', c.id,
                            'name', COALESCE(c.name, 'other'),
                            'spend', COALESCE(
                                (
                                    SELECT SUM(e.amount)
                                    FROM expense e
                                    WHERE e.categoryId = c.id 
                                    AND e.paidBy = ?
                                ), 
                                0
                            )
                        )
                    ) AS categories
                    FROM category c WHERE c.createdBy = ? AND c.isDeleted = false;`;
  const info = await execute(query, [id,id]);
  
  // Parse the JSON string from the result
  if (info && info[0] && info[0].categories) {
    return JSON.parse(info[0].categories);
  }
  return []; // Return empty array if no data found
}

export async function getExpenseByMonthDB(id: any) {
  const query = `WITH RECURSIVE month_series AS (
                        SELECT MONTH(CURDATE()) AS month, YEAR(CURDATE()) AS year, 0 AS level
                        UNION ALL
                        SELECT 
                            CASE
                                WHEN month = 1 THEN 12
                                ELSE month - 1
                            END AS month,
                            CASE
                                WHEN month = 1 THEN year - 1
                                ELSE year
                            END AS year,
                            level + 1
                        FROM month_series
                        WHERE level < 5
                    ),
                    monthly_data AS (
                        SELECT 
                            CONCAT(
                                CASE m.month
                                    WHEN 1 THEN 'January'
                                    WHEN 2 THEN 'February'
                                    WHEN 3 THEN 'March'
                                    WHEN 4 THEN 'April'
                                    WHEN 5 THEN 'May'
                                    WHEN 6 THEN 'June'
                                    WHEN 7 THEN 'July'
                                    WHEN 8 THEN 'August'
                                    WHEN 9 THEN 'September'
                                    WHEN 10 THEN 'October'
                                    WHEN 11 THEN 'November'
                                    WHEN 12 THEN 'December'
                                END,
                                ' ',
                                m.year
                            ) AS month_year,
                            COALESCE(SUM(e.amount), 0) AS total_spending
                        FROM 
                            month_series m
                        LEFT JOIN 
                            expense e ON MONTH(FROM_UNIXTIME(e.date/1000)) = m.month
                            AND YEAR(FROM_UNIXTIME(e.date/1000)) = m.year
                            AND e.paidBy = ?
                        GROUP BY 
                            m.year, m.month
                        ORDER BY 
                            m.year DESC, m.month DESC
                    )
                    SELECT 
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'monthYear', month_year,
                                    'spending', total_spending
                                )
                        ) AS result
                    FROM monthly_data;`
                
  const info = await execute(query, [id]);
  
  if (info && info[0] && info[0].result) {
    return JSON.parse(info[0].result);
  }
  return []; 
}

export async function getIndividualBalanceDB(id: any) {
  const query = `WITH allUsers AS (
                    -- Get all users except the logged-in user
                    SELECT id, name 
                    FROM users 
                    WHERE id != '${id}'
                ),
                userBalances AS (
                    -- Calculate balances where the logged-in user paid
                    SELECT 
                        owedBy AS otherUserId,
                        SUM(amount) AS theyOweMe
                    FROM expenseDetail
                    WHERE paidBy = '${id}'
                    GROUP BY owedBy
                    
                    UNION ALL
                    
                    -- Calculate balances where other users paid
                    SELECT 
                        paidBy AS otherUserId,
                        -SUM(amount) AS iOweThem
                    FROM expenseDetail
                    WHERE owedBy = ?
                    GROUP BY paidBy
                )

                SELECT 
                    u.name AS userName,
                    COALESCE(SUM(ub.theyOweMe), 0) AS netBalance
                FROM allUsers u
                LEFT JOIN userBalances ub ON u.id = ub.otherUserId
                GROUP BY u.id, u.name
                ORDER BY netBalance DESC;`;
  const info = await execute(query, [id]);
  return info;
}

export async function getBalanceOverviewDB(id: any, month: number, year: number) {
  const query = `SELECT 
                  JSON_OBJECT(
                    'totalOwed', COALESCE(
                      (SELECT SUM(ed.amount)
                       FROM expense e
                       JOIN expenseDetail ed ON e.id = ed.expenseId
                       WHERE e.paidBy = ?
                       AND MONTH(FROM_UNIXTIME(e.date/1000)) = ?
                       AND YEAR(FROM_UNIXTIME(e.date/1000)) = ?
                      ), 0
                    ),
                    'totalOwes', COALESCE(
                      (SELECT SUM(ed.amount)
                       FROM expense e
                       JOIN expenseDetail ed ON e.id = ed.expenseId
                       WHERE ed.owedBy = ?
                       AND e.paidBy != ?
                       AND MONTH(FROM_UNIXTIME(e.date/1000)) = ?
                       AND YEAR(FROM_UNIXTIME(e.date/1000)) = ?
                      ), 0
                    )
                  ) AS balance`;
                
  const info = await execute(query, [id, month, year, id, id, month, year]);
  
  if (info && info[0] && info[0].balance) {
    return JSON.parse(info[0].balance);
  }
  return {
    totalOwed: 0,
    totalOwes: 0
  };
}