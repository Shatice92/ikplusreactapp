import React, { useEffect, useState } from "react";
import "./Notifications.css";
import AdminSideBar from "../components/organisms/AdminSideBar";
import CompanyManagerSidebar from "../components/organisms/CompanyManagerSidebar";
import EmployeeSideBar from "../components/organisms/EmployeeSideBar";
import { useNavigate } from "react-router";
import { INotifications } from "../model/INotifications";

type RoleName = "ADMIN" | "COMPANY_MANAGER" | "EMPLOYEE" | "VISITOR" | "WEBSITE_MEMBER";

function Notifications() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [userRole, setUserRole] = useState<RoleName | null>(null);
    const [notifications, setNotifications] = useState<INotifications[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        fetch("http://localhost:9090/v1/dev/user/dashboard", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((roleData) => {
                if (roleData.code === 200) {
                    setUserRole(roleData.data);
                } else {
                    console.error("Rol bilgisi alınamadı");
                }
            })
            .catch((err) => console.error("Rol API hatası:", err));
    }, [navigate]);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        fetch("http://localhost:9090/v1/dev/notification/get-notifications-by-employeeId", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code === 200 && Array.isArray(data.data)) {
                    setNotifications(data.data);
                } else {
                    setNotifications([]);
                    console.error("Bildirimler alınamadı veya yanlış formatta geldi", data);
                }
            })
            .catch((err) => {
                console.error("API hatası:", err);
                setNotifications([]);
            });
    }, []);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const renderSidebar = () => {
        if (!userRole || userRole === "VISITOR" || userRole === "WEBSITE_MEMBER") {
            return null;
        }
        switch (userRole) {
            case "ADMIN":
                return <AdminSideBar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />;
            case "COMPANY_MANAGER":
                return <CompanyManagerSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />;
            case "EMPLOYEE":
                return <EmployeeSideBar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />;
            default:
                return null;
        }
    };

    const getNotificationClass = (type: string) => {
        switch (type) {
            case "success":
                return "Message--green";
            case "warning":
                return "Message--orange";
            case "error":
                return "Message--red";
            default:
                return "Message--orange";
        }
    };

    const markAsRead = (id: number) => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        fetch(`http://localhost:9090/v1/dev/notification/mark-as-read/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code === 200) {
                    setNotifications((prev) =>
                        prev.map((notification) =>
                            notification.id === id ? { ...notification, isRead: true } : notification
                        )
                    );
                } else {
                    console.error("Bildirimi okundu olarak işaretleme başarısız:", data);
                }
            })
            .catch((err) => console.error("Okundu API hatası:", err));
    };
    const handleDelete = (id: number) => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        fetch(`http://localhost:9090/v1/dev/notification/delete/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code === 200) {
                    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
                } else {
                    console.error("Bildirimi silme başarısız:", data);
                }
            })
            .catch((err) => console.error("Silme API hatası:", err));
    };


    return (
        <div className="deneme-container">
            {renderSidebar()}

            <div className={`content-container ${sidebarCollapsed ? "expanded" : ""}`}>
                <h2 className="text-2xl font-bold mb-4">Bildirimler</h2>



                <div className="notifications-list">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`Message ${getNotificationClass(notification.notificationType)} ${notification.isRead ? "Message--read" : ""}`}
                            >
                                <div className="Message-icon">
                                    {notification.notificationType === "success" && <i className="fa fa-check"></i>}
                                    {notification.notificationType === "warning" && <i className="fa fa-exclamation"></i>}
                                    {notification.notificationType === "error" && <i className="fa fa-times-circle"></i>}
                                    {notification.notificationType === "info" && <i className="fa fa-info-circle"></i>}
                                </div>

                                <div className="Message-body">
                                    <h3 className="font-bold">{notification.title}</h3>
                                    <p>{notification.notification}</p>
                                    <small className="text-gray-500">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </small>

                                    {/* Okundu ve Silme Butonları */}
                                    <div className="Message-actions">
                                        {!notification.isRead && (
                                            <button className="btn-read" onClick={() => markAsRead(notification.id)}>
                                                Okundu Olarak İşaretle
                                            </button>
                                        )}
                                        <button className="btn-delete" onClick={() => handleDelete(notification.id)}>
                                            Sil
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Hiç bildirim yok.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Notifications;
