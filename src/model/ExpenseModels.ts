export interface IExpenses {
    id: number;
    employeeId: number;
    expenseType: string;
    amount: number;
    currency: string;
    date: string;
    description: string;
    receiptUrl?: string;
    status: string;
} 

export interface IApiResponse {
    code: number;
    data: IExpenses[];
    message?: string;
}