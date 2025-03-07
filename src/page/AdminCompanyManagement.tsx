import React, { useEffect, useState } from "react";
import { Table, Button, Switch, Select, Menu } from "antd";
import { useNavigate } from "react-router";
import { Modal } from "antd";
import './AdminCompanyManagement.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AdminSidebar from "../components/organisms/AdminSideBar";
 
interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}
 
interface Company {
    id: number;
    name: string;
    registrationDate: string;
    isApproved: boolean;
    emailVerified: boolean;
    membershipPlan: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo: string;
    sector: string;
    taxNumber: string;
    taxOffice: string;
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
                    <a href="#">
                        <i className="fas fa-chart-line"></i>
                        <span>Şirket Bilgileri</span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <i className="fas fa-chart-line"></i>
                        <span>Şirket Belgeleri</span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <i className="fas fa-chart-line"></i>
                        <span>Üyelik ve Faturalandırma</span>
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
 
            <div className="sidebar-footer">
                IK Plus v1.0.0
            </div>
        </div>
    );
};
 



 
const CompanyManagement: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>("");


    useEffect(() => {
        fetchAssets();
      }, []);
   
      const fetchAssets = () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setErrorMessage("Geçersiz veya eksik token!");
          return;
        }
   
        fetch("http://localhost:9090/v1/dev/admin/companies/getAll", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) setCompanies(data.data);
            else setErrorMessage(data.message || "API Response Error");
          })
          .catch((error) => setErrorMessage(error.message));
      };

      
   
     const handleApprove = (companyId: number) => {
        fetch(`http://localhost:9090/v1/dev/admin/companies/approve/${companyId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${companyId}`,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.code === 200) {
                setCompanies((prevCompanies) =>
                    prevCompanies.map((company) =>
                        company.id === companyId ? { ...company, isApproved: !company.isApproved } : company
                    )
                );
                alert("Şirket onay durumu güncellendi!");
            } else {
                console.error("Şirket onaylanırken hata oluştu");
            }
        })
        .catch((err) => console.error("Güncelleme sırasında hata:", err));
    };


    // ❌ Şirketi reddetme fonksiyonu (Backend ile bağlantılı)
    const handleReject = (companyId: number) => {
        fetch(`http://localhost:9090/v1/dev/admin/companies/reject/${companyId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${companyId}`,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.code === 200) {
                setCompanies((prevCompanies) => prevCompanies.filter((company) => company.id !== companyId));
                alert("Şirket reddedildi!");
            } else {
                console.error("Şirket reddedilirken hata oluştu");
            }
        })
        .catch((err) => console.error("Reddetme sırasında hata:", err));
    };

      

   

    // **Bir Şirketi Güncelleme API Çağrısı**
    const handleUpdateCompany = (companyId: number, updatedCompanyData: Partial<Company>) => {
        fetch(`http://localhost:9090/v1/dev/admin/companies/update/${companyId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${companyId}`,
            },
            body: JSON.stringify(updatedCompanyData),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.code === 200) {
                setCompanies(companies.map(company =>
                    company.id === companyId ? { ...company, ...updatedCompanyData } : company
                ));
                alert("Şirket başarıyla güncellendi!");
            } else {
                console.error("Şirket güncellenirken hata oluştu");
            }
        })
        .catch((err) => console.error("Güncelleme sırasında hata:", err));
    };

   
    
  
    

 
    const handleLogout = () => {
        sessionStorage.removeItem("token");
        navigate("/login");
    };
 
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };
 
    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Şirket Adı", dataIndex: "name", key: "name" },
        { title: "Kayıt Tarihi", dataIndex: "registrationDate", key: "registrationDate" },
        { title: "Adres", dataIndex: "address", key: "address" },
        { title: "Telefon", dataIndex: "phone", key: "phone" },
        { title: "E-Posta", dataIndex: "email", key: "email" },
        { title: "Web Sitesi", dataIndex: "website", key: "website" },
        { title: "Sektör", dataIndex: "sector", key: "sector" },
        { title: "Vergi No", dataIndex: "taxNumber", key: "taxNumber" },
        { title: "Vergi Dairesi", dataIndex: "taxOffice", key: "taxOffice" },
        {
            title: "Logo",
            dataIndex: "logo",
            key: "logo",
            render: (logo: string) => <img src={logo} alt="Şirket Logosu" width={50} height={50} />
        },
        {
            title: "Onay Durumu",
            dataIndex: "isApproved",
            key: "isApproved",
            render: (_: any, record: Company) => (
                <Switch checked={record.isApproved} onChange={() => setCompanies(companies.map(company => company.id === record.id ? { ...company, isApproved: !company.isApproved } : company))} />
            ),
        },
        {
            title: "Üyelik Planı",
            dataIndex: "membershipPlan",
            key: "membershipPlan",
            render: (_: any, record: Company) => (
                <Select value={record.membershipPlan} onChange={(value) => setCompanies(companies.map(company => company.id === record.id ? { ...company, membershipPlan: value } : company))}>
                    <Select.Option value="Aylık">Aylık</Select.Option>
                    <Select.Option value="Yıllık">Yıllık</Select.Option>
                </Select>
            ),
        },
        {
            title: "İşlemler",
            render: (_: any, record: Company) => (
                <Button onClick={() => setCompanies(companies.filter(company => company.id !== record.id))} danger>Sil</Button>
            ),
        },
    ];
 
    return (
        <div className="deneme-container">
            <AdminSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <div className="personal-management-container">
            <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                <section className="bg-light py-5 py-md-7 py-xl-10">
                    <div className="container">
                        <div className="row justify-content-between align-items-center mb-4" id="header">
                           
                        </div>
                        <h1 className="text-center mt-5">Şirket Yönetimi</h1>
                        <Table columns={columns} dataSource={companies} rowKey="id" className="mt-4" />
                    </div>
                </section>
            </main>
        </div>
        </div>
    );
};
 
export default CompanyManagement;
 
 