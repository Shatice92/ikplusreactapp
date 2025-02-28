import { useNavigate } from "react-router";
import "./Sidebar.css";

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

const CompanyManagerSidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
    const navigate = useNavigate();

    const handleLeaveNavigation = () => {
        navigate("/companymanager-leaves");
    };

    const handleShiftNavigation = () => {
        navigate("/companymanager-shifts");
    };

    const handleAssetNavigation = () => {
        navigate("/companymanager-assets");
    };

    const handleSalaryNavigation = () => {
        navigate("/companymanager-salaries");
    };

    const handleBonusNavigation = () => {
        navigate("/companymanager-bonuses");
    };

    const handleExpenseNavigation = () => {
        navigate("/companymanager-expenses");
    };

    const handleReportNavigation = () => {
        navigate("/companymanager-reports");
    };
    const handlePersonalNavigation = () => {
        navigate("/companymanager-personal-management");
    };

    const handleProfileNavigation = () => {
        navigate("/profile");
    };

    const handleSettingsNavigation = () => {
        navigate("/companymanager-settings");
    };

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
                <a onClick={handlePersonalNavigation}>
                        <i className="fas fa-users"></i>
                        <span>Personel Yönetimi</span>
                    </a>
                </li>
                <li>
                    <a onClick={handleLeaveNavigation}>
                        <i className="fas fa-calendar-alt"></i>
                        <span>İzin Yönetimi</span>
                    </a>
                </li>
                <li>
                    <a onClick={handleShiftNavigation}>
                        <i className="fas fa-clock"></i>
                        <span>Vardiya Yönetimi</span>
                    </a>
                </li>
                <li>
                    <a onClick={handleAssetNavigation}>
                        <i className="fas fa-box"></i>
                        <span>Zimmet Yönetimi</span>
                    </a>
                </li>

                <li className="menu-label">Finans</li>
                <li>
                    <a onClick={handleSalaryNavigation}>
                        <i className="fas fa-money-bill-wave"></i>
                        <span>Maaş Yönetimi</span>
                    </a>
                </li>
                <li>
                    <a onClick={handleBonusNavigation}>
                        <i className="fas fa-gift"></i>
                        <span>Prim Yönetimi</span>
                    </a>
                </li>
                <li>
                    <a onClick={handleExpenseNavigation}>
                        <i className="fas fa-receipt"></i>
                        <span>Harcama Yönetimi</span>
                    </a>
                </li>

                <li className="menu-label">Diğer</li>
                <li>
                    <a onClick={handleReportNavigation}>
                        <i className="fas fa-chart-line"></i>
                        <span>Raporlar</span>
                    </a>
                </li>
                <li>
                    <a onClick={handleProfileNavigation}>
                        <i className="fas fa-user-cog"></i>
                        <span>Profil Ayarları</span>
                    </a>
                </li>
                <li>
                    <a onClick={handleSettingsNavigation}>
                        <i className="fas fa-cog"></i>
                        <span>Ayarlar</span>
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
