import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CompanyManagerPermissions.css';
import CompanyManagerSidebar from '../components/organisms/CompanyManagerSidebar';
 

 
interface CompanyManagerPermissionRequest {
    employeeName: string;
    startDate: string;
    endDate: string;
    type: string;
    status: "Pending" | "Approved" | "Rejected";
}
 
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
            <CompanyManagerSidebar collapsed={false} onToggle={function (): void {
                throw new Error('Function not implemented.');
            } } />
            
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
                </div> 

    )
};

export default CompanyManagerPermissions;
