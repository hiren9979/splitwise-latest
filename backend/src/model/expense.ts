export interface Expense {
  id: number;
  amount: number;
  description: string;
  title: string;
  paidBy: string;
  date: number;
  categoryId: string;
  owedBy: string[];
  notes?: string;
}
