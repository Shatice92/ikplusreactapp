import "./Sidebar.css";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  
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
                      <span>Personel Yönetimi</span>
                  </a>
              </li>
              <li>
                  <a href="#">
                      <i className="fas fa-calendar-alt"></i>
                      <span>İzin Yönetimi</span>
                  </a>
              </li>
              <li>
                  <a href="#">
                      <i className="fas fa-clock"></i>
                      <span>Vardiya Yönetimi</span>
                  </a>
              </li>
              <li>
                  <a href="#">
                      <i className="fas fa-box"></i>
                      <span>Zimmet Yönetimi</span>
                  </a>
              </li>
              
              <li className="menu-label">Finans</li>
              <li>
                  <a href="#">
                      <i className="fas fa-money-bill-wave"></i>
                      <span>Maaş Yönetimi</span>
                  </a>
              </li>
              <li>
                  <a href="#">
                      <i className="fas fa-gift"></i>
                      <span>Prim Yönetimi</span>
                  </a>
              </li>
              <li>
                  <a href="#">
                      <i className="fas fa-receipt"></i>
                      <span>Harcama Yönetimi</span>
                  </a>
              </li>
              
              <li className="menu-label">Diğer</li>
              <li>
                  <a href="#">
                      <i className="fas fa-chart-line"></i>
                      <span>Raporlar</span>
                  </a>
              </li>
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
          </ul>
        
      </div>
  );
};

export default Sidebar;