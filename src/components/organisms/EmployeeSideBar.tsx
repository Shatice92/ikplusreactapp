import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import "./Sidebar.css";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const EmployeeSidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();

  const onNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <img
            src={collapsed ? "/assets/logo1.png" : "/assets/logo2.png"}
            alt="IK Plus Logo"
            className="sidebar-logo"
          />
        </div>

        <button className="sidebar-toggle" onClick={onToggle}>
          <i className={`fas ${collapsed ? "fa-chevron-right" : "fa-chevron-left"}`}></i>
        </button>
      </div>

      <ul className="sidebar-menu">
        <li className="menu-label">Ana Menü</li>
        <li>
          <a onClick={() => onNavigate("/employee-leaves")}>
            <i className="fas fa-calendar-alt"></i>
            <span>İzin Yönetimi</span>
          </a>
        </li>
        <li>
          <a onClick={() => onNavigate("/employee-shifts")}>
            <i className="fas fa-clock"></i>
            <span>Vardiya Yönetimi</span>
          </a>
        </li>
        <li>
          <a onClick={() => onNavigate("/employee-assets")}>
            <i className="fas fa-box"></i>
            <span>Zimmet Yönetimi</span>
          </a>
        </li>

        <li className="menu-label">Finans</li>
        <li>
          <a onClick={() => onNavigate("/employee-expenses")}>
            <i className="fas fa-receipt"></i>
            <span>Harcama Yönetimi</span>
          </a>
        </li>

        <li className="menu-label">Diğer</li>
        <li>
          <a onClick={() => onNavigate("/profile")}>
            <i className="fas fa-user-cog"></i>
            <span>Profil Ayarları</span>
          </a>
        </li>
        <li>
          <a onClick={() => onNavigate("/notifications")}>
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

export default EmployeeSidebar;