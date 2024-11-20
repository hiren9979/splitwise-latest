import { User } from "./user.model";

export interface Expense {
    id: number;
    totalExpense: number;
    expense?: any;
    splitType: 'equally' | 'unequally';
    notes?: string;
    users: User[]; // Array of User objects involved in the expense
}   