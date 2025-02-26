import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './personalmanagement.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './CompanyManagerPermissions.css';
 
interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}
 
interface CompanyManagerPermissionRequest {
    employeeName: string;
    startDate: string;
    endDate: string;
    type: string;
    status: "Pending" | "Approved" | "Rejected";
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
            
            <div className="sidebar-footer">
                IK Plus v1.0.0
            </div>
        </div>
    );
};
 
const CompanyManagerPermissions: React.FC = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [companyManagerPermissionRequests, setCompanyManagerPermissionRequests] = useState<CompanyManagerPermissionRequest[]>([
        {
            employeeName: "Emirhan Aydın",
            startDate: "2025-03-01",
            endDate: "2025-03-05",
            type: "Sick Leave",
            status: "Pending",
        },
        {
            employeeName: "Buğra Aydın",
            startDate: "2025-03-10",
            endDate: "2025-03-15",
            type: "Annual Leave",
            status: "Pending",
        },
        {
            employeeName: "Emirhan Buğra Aydın",
            startDate: "2025-03-10",
            endDate: "2025-03-15",
            type: "Marriage Leave",
            status: "Pending",
        },
    ]);
 
    const [newRequest, setNewRequest] = useState({
        employeeName: "",
        startDate: "",
        endDate: "",
        type: "",
    });
 
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
 
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };
 
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewRequest(prevState => {
            const updatedRequest = { ...prevState, [name]: value };
 
            if (updatedRequest.startDate && updatedRequest.endDate && updatedRequest.startDate > updatedRequest.endDate) {
                setErrorMessage("Başlangıç tarihi bitiş tarihinden sonra olamaz!");
                updatedRequest.endDate = updatedRequest.startDate;
            } else {
                setErrorMessage(null);
            }
 
            return updatedRequest;
        });
    };
 
    const handleAddRequest = () => {
        setCompanyManagerPermissionRequests([
            ...companyManagerPermissionRequests,
            { ...newRequest, status: 'Pending' as 'Pending' },
        ]);
        setNewRequest({ employeeName: "", startDate: "", endDate: "", type: "" });
    };
 
    const handleUpdateRequest = () => {
        if (editIndex !== null) {
            const updatedRequests = [...companyManagerPermissionRequests];
            updatedRequests[editIndex] = { ...newRequest, status: updatedRequests[editIndex].status };
            setCompanyManagerPermissionRequests(updatedRequests);
            setEditIndex(null);
            setNewRequest({ employeeName: "", startDate: "", endDate: "", type: "" });
        }
    };
 
    const handleEditRequest = (index: number) => {
        setEditIndex(index);
        setNewRequest(companyManagerPermissionRequests[index]);
    };
 
    const handleDeleteRequest = (index: number) => {
        setCompanyManagerPermissionRequests(companyManagerPermissionRequests.filter((_, i) => i !== index));
    };
 
    const handleApprove = (index: number) => {
        const updatedRequests = [...companyManagerPermissionRequests];
        updatedRequests[index].status = "Approved";
        setCompanyManagerPermissionRequests(updatedRequests);
    };
 
    const handleReject = (index: number) => {
        const updatedRequests = [...companyManagerPermissionRequests];
        updatedRequests[index].status = "Rejected";
        setCompanyManagerPermissionRequests(updatedRequests);
    };
 
    return (
        <div className="personal-management-container">
            <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
            <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                <div className="permissions-container">
                    <h2>İzin Talepleri</h2>
 
                    <div className="new-request-form">
                        <h3>{editIndex !== null ? "İzni Güncelle" : "Yeni İzin Talebi Ekle"}</h3>
                        <input
                            type="text"
                            name="employeeName"
                            value={newRequest.employeeName}
                            placeholder="Çalışan Adı"
                            onChange={handleInputChange}
                        />
                        <input
                            type="date"
                            name="startDate"
                            value={newRequest.startDate}
                            onChange={handleInputChange}
                        />
                        <input
                            type="date"
                            name="endDate"
                            value={newRequest.endDate}
                            onChange={handleInputChange}
                        />
                        <select
                            name="type"
                            value={newRequest.type}
                            onChange={handleInputChange}
                        >
                            <option value="">İzin Türü Seçin</option>
                            <option value="Annual Leave">Yıllık İzin</option>
                            <option value="Sick Leave">Sağlık İzni</option>
                            <option value="Maternity Leave">Kadın Doğum İzni</option>
                            <option value="Paternity Leave">Erkek Doğum İzni</option>
                            <option value="Marriage Leave">Evlilik İzni</option>
                            <option value="Bereavement Leave">Vefat İzni</option>
                            <option value="Compensatory Leave">Fazla Mesai İzni</option>
                            <option value="Unpaid Leave">Ücretsiz İzin</option>
                            <option value="Study Leave">Mesleki Eğitim İzni</option>
                            <option value="Public Holiday">Ulusal İzin</option>
                            <option value="Religious Holiday">Dini Bayram İzni</option>
                            <option value="Emergency Leave">Acil Durum İzni</option>
                            <option value="Voiting Leave">Seçim İzni</option>
                            <option value="Military Leave">Askerlik İzni</option>
                            <option value="Medical Leave">Tedavi İzni</option>
                            <option value="Adoption Leave">Evlat Edinme İzni</option>
                            <option value="Special Occasion Leave">Özel Gün İzni</option>
                            <option value="Quarantine Leave">Karantina İzni</option>
                            <option value="Work From Home">Evden Çalışma İzni</option>
                        </select>
                        {editIndex !== null ? (
                            <button onClick={handleUpdateRequest}>Güncelle</button>
                        ) : (
                            <button onClick={handleAddRequest}>Ekle</button>
                        )}
                    </div>
 
                    <div className="requests-list">
                        <h3>İzin Talepleri</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Çalışan Adı</th>
                                    <th>Başlangıç Tarihi</th>
                                    <th>Bitiş Tarihi</th>
                                    <th>İzin Türü</th>
                                    <th>Durum</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companyManagerPermissionRequests.map((request, index) => (
                                    <tr key={index}>
                                        <td>{request.employeeName}</td>
                                        <td>{request.startDate}</td>
                                        <td>{request.endDate}</td>
                                        <td>{request.type}</td>
                                        <td>{request.status}</td>
                                        <td>
<div style={{ display: 'flex', gap: '3px', justifyContent: 'flex-start' }}>
    {request.status === "Pending" && (
        <>
            <button
                style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '3px 6px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '11px'
                }}
                onClick={() => handleApprove(index)}
            >
                <i className="fas fa-check" style={{ fontSize: '10px' }}></i>
                Onayla
            </button>
            <button
                style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '3px 6px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '11px'
                }}
                onClick={() => handleReject(index)}
            >
                <i className="fas fa-times" style={{ fontSize: '10px' }}></i>
                Reddet
            </button>
        </>
    )}
    <button
        style={{
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            padding: '3px 6px',
            borderRadius: '3px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '11px'
        }}
        onClick={() => handleEditRequest(index)}
    >
        <i className="fas fa-edit" style={{ fontSize: '10px' }}></i>
        Düzenle
    </button>
    <button
        style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '3px 6px',
            borderRadius: '3px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '11px'
        }}
        onClick={() => handleDeleteRequest(index)}
    >
        <i className="fas fa-trash-alt" style={{ fontSize: '10px' }}></i>
        Sil
    </button>
</div>
</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};
 
export default CompanyManagerPermissions;