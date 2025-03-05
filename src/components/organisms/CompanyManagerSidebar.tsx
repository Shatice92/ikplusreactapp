import { useNavigate } from "react-router";
import "./Sidebar.css";

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

const CompanyManagerSidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
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
                    <a onClick={() => handleNavigation("/companymanager-personal-management")}>
                        <i className="fas fa-users"></i>
                        <span>Personel Yönetimi</span>
                    </a>
                </li>
                <li>
                    <a onClick={() => handleNavigation("/companymanager-leaves")}>
                        <i className="fas fa-calendar-alt"></i>
                        <span>İzin Yönetimi</span>
                    </a>
                </li>
                <li>
                    <a onClick={() => handleNavigation("/companymanager-shifts")}>
                        <i className="fas fa-clock"></i>
                        <span>Vardiya Yönetimi</span>
                    </a>
                </li>
                <li>
                    <a onClick={() => handleNavigation("/companymanager-assets")}>
                        <i className="fas fa-box"></i>
                        <span>Zimmet Yönetimi</span>
                    </a>
                </li>

                <li className="menu-label">Finans</li>
                <li>
                    <a onClick={() => handleNavigation("/companymanager-salaries")}>
                        <i className="fas fa-money-bill-wave"></i>
                        <span>Maaş Yönetimi</span>
                    </a>
                </li>
                <li>
                    <a onClick={() => handleNavigation("/companymanager-bonuses")}>
                        <i className="fas fa-gift"></i>
                        <span>Prim Yönetimi</span>
                    </a>
                </li>
                <li>
                    <a onClick={() => handleNavigation("/companymanager-expenses")}>
                        <i className="fas fa-receipt"></i>
                        <span>Harcama Yönetimi</span>
                    </a>
                </li>

                <li className="menu-label">Diğer</li>
                <li>
                    <a onClick={() => handleNavigation("/companymanager-reports")}>
                        <i className="fas fa-chart-line"></i>
                        <span>Raporlar</span>
                    </a>
                </li>
                <li>
                    <a onClick={() => handleNavigation("/profile")}>
                        <i className="fas fa-user-cog"></i>
                        <span>Profil Ayarları</span>
                    </a>
                </li>
                <li>
                    <a onClick={() => handleNavigation("/companymanager-settings")}>
                        <i className="fas fa-cog"></i>
                        <span>Ayarlar</span>
                    </a>
                </li>
                <li>
                    <a onClick={() => handleNavigation("/companymanager-comments")}>
                        <i className="fas fa-question-circle"></i>
                        <span>Bizi Değerlendirin</span>
                    </a>
                </li>

                <button className='logout-button' onClick={() => {
                    sessionStorage.removeItem("token");
                    navigate("/login");
                }}>
                    Sistemden Çıkış Yap
                </button>
            </ul>
        </div>
    );
};

export default CompanyManagerSidebar;