import { useEffect, useState } from "react";
import { IAssets } from "../model/IAssets";
import CompanyManagerSidebar from "../components/organisms/CompanyManagerSidebar";
import CompanyManagerAssetsTable from "../components/organisms/CompanyManagerAssetsTable";




const CompanyManagerAssetManagement = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="deneme-container">
            <CompanyManagerSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
            <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                <div className="content">

                    <CompanyManagerAssetsTable />
                </div>
            </main>
        </div>
    );
};

export default CompanyManagerAssetManagement;