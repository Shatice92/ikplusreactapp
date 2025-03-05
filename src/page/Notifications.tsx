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

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // Kullanıcının rolünü getir
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

        // Bildirimleri getir
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
                setNotifications([]); // API hatası durumunda listeyi boş bırak
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

    // Bildirim tipine göre CSS sınıfı belirleme
    const getNotificationClass = (type: string) => {
        switch (type) {
            case "success":
                return "Message--green"; // Başarılı bildirim (yeşil)
            case "warning":
                return "Message--orange"; // Uyarı (turuncu)
            case "error":
                return "Message--red"; // Hata (kırmızı)
            default:
                return "Message--orange";
        }
    };

    // Bildirimi okundu olarak işaretleme
    const markAsRead = (id: number) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id ? { ...notification, isRead: true } : notification
            )
        );
    };

    return (
        <div className="deneme-container">
            {renderSidebar()} {/* Sidebar dinamik olarak render ediliyor */}

            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Bildirimler</h2>
                <div className="space-y-3">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`Message ${getNotificationClass(notification.notificationType)} ${notification.isRead ? "Message--read" : ""
                                    }`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                {/* Bildirim Tipine Göre İkon Seçimi */}
                                <div className="Message-icon">
                                    {notification.notificationType === "success" && <i className="fa fa-check"></i>}
                                    {notification.notificationType === "warning" && <i className="fa fa-exclamation"></i>}
                                    {notification.notificationType === "error" && <i className="fa fa-times-circle"></i>}
                                    {notification.notificationType === "info" && <i className="fa fa-info-circle"></i>}
                                </div>

                                {/* Bildirim İçeriği */}
                                <div className="Message-body">
                                    <h3 className="font-bold">{notification.title}</h3>
                                    <p>{notification.notification}</p>
                                    <small className="text-gray-500">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </small>
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
