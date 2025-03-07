export interface ICompanyManagerPermissions {
    id : number;
    employeeName: string;
    startDate: string;
    endDate: string;
    type: string;
    status: "Pending" | "Approved" | "Rejected";
}