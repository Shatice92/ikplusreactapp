import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
    const navigate = useNavigate();


    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="logo-container">
                    <img src={collapsed ? "/assets/logo1.png" : "/assets/logo2.png"} alt="IK Plus Logo" className="sidebar-logo" />
                </div>

                <button className="sidebar-toggle" onClick={onToggle}>
                    <i className={`fas ${collapsed ? "fa-chevron-right" : "fa-chevron-left"}`}></i>
                </button>
            </div>

            <ul className="sidebar-menu">
                <li className="menu-label">Ana Menü</li>
                <li>
                    <a onClick={() => handleNavigation("/company-management")}>
                        <i className="fas fa-users"></i>
                        <span>Şirket Yönetimi</span>
                    </a>
                </li>
                <li>
                    <a onClick={() => handleNavigation("/definition-management")}>
                        <i className="fas fa-users"></i>
                        <span>Tanımlamalar Yönetimi</span>
                    </a>
                </li>

                <li className="menu-label">Diğer</li>
                <li>
                    <a onClick={() => handleNavigation("/profile")}>
                        <i className="fas fa-user-cog"></i>
                        <span>Profil Ayarları</span>
                    </a>
                </li>
                <li>
                    <a onClick={() => handleNavigation("/notifications")}>
                        <i className="fas fa-cog"></i>
                        <span>Bildirimler</span>
                    </a>
                </li>
                <li>
                    <a
                        onClick={() => {
                            sessionStorage.removeItem("token");
                            navigate("/login");
                        }}
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Çıkış Yap</span>
                    </a>
                </li>
            </ul>

        </div>
    );
};

export default AdminSidebar;