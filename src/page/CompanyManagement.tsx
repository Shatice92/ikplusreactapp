import React, { useState } from "react";
import { Table, Button, Switch, Select, Menu } from "antd";
import { useNavigate } from "react-router";
import './CompanyManagement.css';

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

const mockCompanies: Company[] = [
  { id: 1, name: "ABC Ltd.", registrationDate: "2023-01-10", isApproved: false, emailVerified: true, membershipPlan: "Yıllık", description: "Teknoloji Şirketi", address: "İstanbul, Türkiye", phone: "+90 212 123 45 67", email: "info@abc.com", website: "www.abc.com", logo: "/img/svg/logo1.svg", sector: "Teknoloji", taxNumber: "1234567890", taxOffice: "İstanbul" },
  { id: 2, name: "XYZ Corp.", registrationDate: "2022-11-15", isApproved: false, emailVerified: false, membershipPlan: "Aylık", description: "Finans Şirketi", address: "Ankara, Türkiye", phone: "+90 312 987 65 43", email: "contact@xyz.com", website: "www.xyz.com", logo: "/img/svg/logo2.svg", sector: "Finans", taxNumber: "0987654321", taxOffice: "Ankara" },
  { id: 3, name: "Tech Innovations", registrationDate: "2021-09-25", isApproved: true, emailVerified: true, membershipPlan: "Yıllık", description: "Yazılım Şirketi", address: "İzmir, Türkiye", phone: "+90 232 456 78 90", email: "hello@tech.com", website: "www.tech.com", logo: "/img/svg/logo3.svg", sector: "Yazılım", taxNumber: "5678901234", taxOffice: "İzmir" }
];

const CompanyManagement = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
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
    <section className="bg-light py-5 py-md-7 py-xl-10">
      <div className="container">
        <div className="row justify-content-between align-items-center mb-4" id="header">
          <img src="/img/svg/logo.svg" width={140} height={140} alt="IKPLUS Logo" style={{ position: "absolute", top: "10px", left: "10px" }} />
          <div style={{ marginLeft: "auto" }}>
            <Menu mode="horizontal" style={{ justifyContent: "flex-end", marginTop: "10px" }}>
              <Menu.Item key="companies">Şirketler</Menu.Item>
              <Menu.Item key="profile">Profil Ayarları</Menu.Item>
              <Menu.Item key="logout" onClick={handleLogout}>Çıkış</Menu.Item>
            </Menu>
          </div>
        </div>
        <h1 className="text-center mt-5">Şirket Yönetimi</h1>
        <Table columns={columns} dataSource={companies} rowKey="id" className="mt-4" />
      </div>
    </section>
  );
};

export default CompanyManagement;

