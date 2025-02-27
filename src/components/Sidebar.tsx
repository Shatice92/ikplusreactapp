import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="logo-container">
                    {collapsed ? (
                        <img src="/assets/logo1.png" alt="IK Plus Logo" className="sidebar-logo small" />
                    ) : (
                        <img src="/assets/logo2.png" alt="IK Plus Logo" className="sidebar-logo" />
                    )}
                </div>
                <button 
                    className="sidebar-toggle" 
                    onClick={onToggle} 
                    title={collapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
                >
                    <i className={`fas fa-chevron-${collapsed ? 'right' : 'left'}`}></i>
                </button>
            </div>
            
            <ul className="sidebar-menu">
                <li>
                    <Link to="/personal-management" className="active">
                        <i className="fas fa-users"></i>
                        <span className="menu-text">Personel Yönetimi</span>
                    </Link>
                </li>
                <li>
                    <Link to="/leave-management">
                        <i className="fas fa-calendar-alt"></i>
                        <span className="menu-text">İzin Yönetimi</span>
                    </Link>
                </li>
                <li>
                    <Link to="/shift-management">
                        <i className="fas fa-clock"></i>
                        <span className="menu-text">Vardiya Yönetimi</span>
                    </Link>
                </li>
                <li>
                    <Link to="/asset-management">
                        <i className="fas fa-box"></i>
                        <span className="menu-text">Zimmet Yönetimi</span>
                    </Link>
                </li>
                
                <li className="menu-divider"><span>Finans</span></li>
                <li>
                    <Link to="/salary-management">
                        <i className="fas fa-money-bill-wave"></i>
                        <span className="menu-text">Maaş Yönetimi</span>
                    </Link>
                </li>
                <li>
                    <Link to="/bonus-management">
                        <i className="fas fa-gift"></i>
                        <span className="menu-text">Prim Yönetimi</span>
                    </Link>
                </li>
                <li>
                    <Link to="/expense-management">
                        <i className="fas fa-receipt"></i>
                        <span className="menu-text">Harcama Yönetimi</span>
                    </Link>
                </li>
                
                <li className="menu-divider"><span>Diğer</span></li>
                <li>
                    <Link to="/reports">
                        <i className="fas fa-chart-line"></i>
                        <span className="menu-text">Raporlar</span>
                    </Link>
                </li>
                <li>
                    <Link to="/profile-settings">
                        <i className="fas fa-user-cog"></i>
                        <span className="menu-text">Profil Ayarları</span>
                    </Link>
                </li>
                <li>
                    <Link to="/settings">
                        <i className="fas fa-cog"></i>
                        <span className="menu-text">Ayarlar</span>
                    </Link>
                </li>
            </ul>
            
            <div className="sidebar-footer">
                <div className="version">IK Plus v1.0.0</div>
                <Link to="/logout" className="logout-link">
                    <i className="fas fa-sign-out-alt"></i>
                    <span className="menu-text">Çıkış</span>
                </Link>
            </div>
        </div>
    );
}; 