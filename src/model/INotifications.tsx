export interface INotifications {
    id: number;
    employeeId: number;
    title: string;
    notification: string;
    createdAt: string;
    isRead: boolean;
    notificationType: string;
}