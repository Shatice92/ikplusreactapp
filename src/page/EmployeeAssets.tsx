import { useState } from "react";
import EmployeeSidebar from "../components/organisms/EmployeeSideBar";

const EmployeeAssets = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="deneme-container">
      <EmployeeSidebar collapsed={collapsed} onToggle={handleToggleSidebar} />
      <div className={`content ${collapsed ? "expanded" : ""}`}>
       
      </div>
    </div>
  );
};

export default EmployeeAssets;
