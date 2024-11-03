export interface Expense {
  id: number;
  amount: number;
  name: string;
  paidBy: string;
  owedBy: string[];
  notes?: string;
}
