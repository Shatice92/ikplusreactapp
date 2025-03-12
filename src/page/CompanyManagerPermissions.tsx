import React, { useEffect, useState } from "react";
import { ICompanyManagerPermissions } from '../model/ICompanyManagerPermissions';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CompanyManagerPermissions.css';
import CompanyManagerSidebar from '../components/organisms/CompanyManagerSidebar';

const leaveTypes = [
    "Annual Leave", "Sick Leave", "Maternity Leave", "Paternity Leave", "Unpaid Leave", "Bereavement Leave", 
    "Compensatory Leave", "Study Leave", "Public Holiday", "Religious Holiday", "Emergency Leave", 
    "Voiting Leave", "Military Leave", "Medical Leave", "Adoption Leave", "Special Occasion Leave", 
    "Quarantine Leave", "Work From Home"
];

const CompanyManagerPermissions: React.FC = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [companyManagerPermissionRequests, setCompanyManagerPermissionRequests] = useState<ICompanyManagerPermissions[]>([]);
    const [newRequest, setNewRequest] = useState<Omit<ICompanyManagerPermissions, "id" | "status">>({
        employeeName: "",
        startDate: "",
        endDate: "",
        type: leaveTypes[0]
    });

    useEffect(() => {
        fetch("http://localhost:9090/v1/dev/company-manager/leaves/list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((res) => res.json())
        .then((data) => setCompanyManagerPermissionRequests(data))
        .catch((err) => console.error("İzin talepleri alınırken hata oluştu:", err));
    }, []);

    const handleAddRequest = () => {
        const employeeId = 9007199254740991;  // Gerçek çalışan ID'si
        const approvedByUserId = 9007199254740991;  // Onaylayan kişi ID'si (Şirket yöneticisi)
        const leaveTypeId = leaveTypes.indexOf(newRequest.type) + 1;  // İzin türü ID'si
    
        const requestBody = {
            employeeId,
            leaveTypeId,
            startDate: newRequest.startDate,
            endDate: newRequest.endDate,
            approvedByUserId
        };
    
        const token = localStorage.getItem("token");
if (!token) {
    console.error("Token bulunamadı. Lütfen giriş yapın.");
    return;
}

fetch("http://localhost:9090/v1/dev/company-manager/leaves/save", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  // Token'ı burada kullanıyoruz
    },
    body: JSON.stringify(requestBody),
})
.then((res) => {
    if (!res.ok) {
        // Eğer yanıt başarılı değilse hata mesajını yazdırıyoruz
        return res.text(); // Yanıtın metin olarak alınmasını sağlıyoruz
    }
    return res.json();
})
.then((data) => {
    if (typeof data === "string") {
        // Hata mesajı metin olarak geldi
        console.error("API Yanıtı: ", data);
    } else {
        console.log("Yeni talep eklendi:", data);
        setCompanyManagerPermissionRequests((prevRequests) => [
            ...prevRequests,
            { ...data.data, status: "Pending" }, // Başlangıçta "Pending" olarak ayarla
        ]);
    }
})
.catch((err) => console.error("İzin talebi eklenirken hata oluştu:", err));
    };

    const handleApprove = (index: number) => {
        const updatedRequest = { ...companyManagerPermissionRequests[index], status: "Approved" };
    
        fetch(`http://localhost:9090/v1/dev/company-manager/leaves/update/${updatedRequest.id}`, {  // id'yi doğru şekilde kullanıyoruz
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,  // Token ile doğrulama
            },
            body: JSON.stringify(updatedRequest),
        })
        .then((res) => res.json())
        .then(() => {
            const updatedRequests = [...companyManagerPermissionRequests];
            updatedRequests[index].status = "Approved";  // Onaylanan talebin statüsünü güncelliyoruz
            setCompanyManagerPermissionRequests(updatedRequests);  // Güncellenmiş talepleri UI'ye yansıtıyoruz
        })
        .catch((err) => console.error("İzin onaylanırken hata oluştu:", err));
    };

    return (
        <div className={`deneme-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <CompanyManagerSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className="permissions-container">
                <h2>İzin Talepleri</h2>

            <div>
                <input
                    type="text"
                    placeholder="Employee Name"
                    value={newRequest.employeeName}
                    onChange={(e) => setNewRequest({ ...newRequest, employeeName: e.target.value })}
                />
                <input
                    type="date"
                    value={newRequest.startDate}
                    onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
                />
                <input
                    type="date"
                    value={newRequest.endDate}
                    onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })}
                />
                <select
                    value={newRequest.type}
                    onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
                >
                    <option value="">İzin Türü Seçin</option>
                    {leaveTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                    ))}
                </select>
                <button onClick={handleAddRequest}>Add Request</button>
                </div>
                <ul>
                    {companyManagerPermissionRequests.map((request, index) => (
                    <li key={index}>
                    {request.employeeName} - {request.startDate} to {request.endDate} ({request.type}) - {request.status}
                    <button onClick={() => handleApprove(index)}>Approve</button>
                    </li>
                ))}
                </ul>
        </div>
        </div>
    );
};

export default CompanyManagerPermissions;