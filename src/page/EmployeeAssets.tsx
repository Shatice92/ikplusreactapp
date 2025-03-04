import { useEffect, useState } from "react";
import EmployeeSidebar from "../components/organisms/EmployeeSideBar";
import { IAssets } from "../model/IAssets";
import AssetsTable from "../components/organisms/EmployeeAssetsTable";
import EmployeeAssetsTable from "../components/organisms/EmployeeAssetsTable";


const EmployeeAssets = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="deneme-container">
      <EmployeeSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="content">
          
          <EmployeeAssetsTable />
        </div>
      </main>
    </div>
  );
};

export default EmployeeAssets;