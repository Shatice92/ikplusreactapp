import { useNavigate } from "react-router";
import "./Sidebar.css";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const EmployeeSidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();

  const handleLeaveNavigation = () => {
    navigate("/employee-leaves");
  };

  const handleShiftNavigation = () => {
    navigate("/employee-shifts");
  };

  const handleAssetNavigation = () => {
    navigate("/employee-assets");
  };

  const handleExpenseNavigation = () => {
    navigate("/employee-expenses");
  };

  const handleProfileNavigation = () => {
    navigate("/profile");
  };

  const handleSettingsNavigation = () => {
    navigate("/employee-settings");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
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
          <a onClick={handleExpenseNavigation}>
            <i className="fas fa-receipt"></i>
            <span>Harcama Yönetimi</span>
          </a>
        </li>

        <li className="menu-label">Diğer</li>
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
        <li>
          <a onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Çıkış Yap</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default EmployeeSidebar;
