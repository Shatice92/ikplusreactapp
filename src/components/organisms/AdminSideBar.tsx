import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
    const navigate = useNavigate();

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="logo-container">
                    {collapsed ? (
                        <img src="/assets/logo1.png" alt="IK Plus Logo" className="sidebar-logo" />
                    ) : (
                        <img src="/assets/logo2.png" alt="IK Plus Logo" className="sidebar-logo" />
                    )}
                </div>

                <button className="sidebar-toggle" onClick={onToggle}>
                    <i className="fas fa-chevron-left"></i>
                </button>
            </div>

            <ul className="sidebar-menu">
                <li className="menu-label">Ana Menü</li>
                <li>
                    <a href="#" className="active">
                        <i className="fas fa-users"></i>
                        <span>Şirket Yönetimi</span>
                    </a>
                </li>
                <li>
                    <a href="#" className="active">
                        <i className="fas fa-users"></i>
                        <span>Tanımlamalar Yönetimi</span>
                    </a>
                </li>
                <li className="menu-label">Diğer</li>
                <li>
                    <a href="#">
                        <i className="fas fa-user-cog"></i>
                        <span>Profil Ayarları</span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <i className="fas fa-cog"></i>
                        <span>Ayarlar</span>
                    </a>
                </li>
                <button className='logout-button' onClick={() => { sessionStorage.removeItem("token"); navigate("/login"); }}>
                    Sistemden Çıkış Yap
                </button>
            </ul>

        </div>
    );
};

export default AdminSidebar;