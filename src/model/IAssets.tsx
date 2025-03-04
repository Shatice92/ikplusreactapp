export interface IAssets{

    id: number;
    employeeId: number;
    name: string;
    serialNumber: string;
    assignedDate: string;
    assetType: string;
    status: AssetStatus;
    dueDate: string;
    companyManagerId: number;

}


export enum AssetStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    REFUND="REFUND"
  }