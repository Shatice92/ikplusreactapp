import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ICompanyManagerPermissions } from '../model/ICompanyManagerPermissions';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CompanyManagerPermissions.css';
import CompanyManagerSidebar from '../components/organisms/CompanyManagerSidebar';

const CompanyManagerPermissions: React.FC = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [companyManagerPermissionRequests, setCompanyManagerPermissionRequests] = useState<ICompanyManagerPermissions[]>([]);
    const [newRequest, setNewRequest] = useState({
        employeeName: "",
        startDate: "",
        endDate: "",
        type: "",
    });
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const fetchEmployees = () => {
        fetch("http://localhost:9090/v1/dev/company-manager/employees/list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            setEmployees(data); // Veriyi employees'e atıyoruz
            setCompanyManagerPermissionRequests(data); // Veriyi permissionRequests'e atıyoruz
        })
        .catch((err) => {
            setErrorMessage("Çalışanları çekerken hata oluştu.");
        });
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const updateEmployee = (id: number, updatedData: Record<string, any>) => {
        fetch(`http://localhost:9090/v1/dev/company-manager/employees/update/{id}`, { // Düzeltilen URL
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify(updatedData),
        })
        .then((res) => res.json())
        .then(() => {
            fetchEmployees();  // Güncellenen çalışan verileri listelenir
            setEditIndex(null);  // Edit işlemi tamamlandığında, düzenleme modundan çıkılır
            setNewRequest({ employeeName: "", startDate: "", endDate: "", type: "" });  // Form sıfırlanır
        })
        .catch((err) => {
            setErrorMessage("Çalışanı güncellerken hata oluştu.");
            console.error("Çalışanı güncellerken hata oluştu:", err);
        });
    };

    const saveEmployee = (employeeData: Record<string, any>) => {
        fetch("http://localhost:9090/v1/dev/company-manager/employees/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify(employeeData),
        })
        .then((res) => res.json())
        .then(() => {
            fetchEmployees();  // Yeni çalışan eklendikten sonra çalışanlar listesi güncelleniyor
            setNewRequest({ employeeName: "", startDate: "", endDate: "", type: "" });  // Formu temizleme
        })
        .catch((err) => {
            setErrorMessage("Çalışan kaydedilirken hata oluştu.");
            console.error("Çalışan kaydedilirken hata oluştu:", err);
        });
    };

    const deleteEmployee = (id: number) => {
        fetch(`http://localhost:9090/v1/dev/company-manager/employees/delete/{id}`, {  // Düzeltilen URL
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        })
        .then((res) => res.json())
        .then(() => fetchEmployees())
        .catch((err) => {
            setErrorMessage("Çalışanı silerken hata oluştu.");
            console.error("Çalışanı silerken hata oluştu:", err);
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewRequest({
            ...newRequest,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className={`deneme-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <CompanyManagerSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className="permissions-container">
                <h2>İzin Talepleri</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                
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
                        <button
                            onClick={() => {
                                if (editIndex !== null) {
                                    const selectedRequest = companyManagerPermissionRequests[editIndex]; // Edit edilen izin talebini alıyoruz
                                    if (selectedRequest) {
                                        updateEmployee(selectedRequest.id, newRequest); // İzin talebini güncelliyoruz
                                    }
                                }
                            }}
                        >
                            Güncelle
                        </button>
                    ) : (
                        <button onClick={() => saveEmployee(newRequest)}>Ekle</button>
                    )}
                </div>

                <h3>İzin Talepleri</h3>
                <ul>
                {companyManagerPermissionRequests.map((request: ICompanyManagerPermissions, index: number) => (
                <li key={request.id}>
                {request.employeeName} - {request.startDate} - {request.endDate} - {request.type}
                <button onClick={() => deleteEmployee(request.id)}>Sil</button>
                <button onClick={() => {
                setEditIndex(index);
                setNewRequest({
                    employeeName: request.employeeName,
                    startDate: request.startDate,
                    endDate: request.endDate,
                    type: request.type,
                });
                }}>
                Düzenle
            </button>
        </li>
    ))}
</ul>
            </div>
        </div>
    );
};

export default CompanyManagerPermissions;