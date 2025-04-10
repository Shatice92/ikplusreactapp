import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import './Permissions.css';
import EmployeeSidebar from '../components/organisms/EmployeeSideBar';

interface PermissionRequest {
  employeeName: string;
  date: string;
  type: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const Permissions = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [permissionRequests, setPermissionRequests] = useState<PermissionRequest[]>([
    { employeeName: 'John Doe', date: '2025-03-01', type: 'Sick Leave', status: 'Pending' },
    { employeeName: 'Jane Smith', date: '2025-03-02', type: 'Annual Leave', status: 'Approved' },
    { employeeName: 'Alice Johnson', date: '2025-03-03', type: 'Maternity Leave', status: 'Rejected' },
  ]);
  const [newRequest, setNewRequest] = useState({ employeeName: '', date: '', type: '' });
  const [employees, setEmployees] = useState([]);
      const navigate = useNavigate();
  
      useEffect(() => {
              const token = sessionStorage.getItem("token");
              if (!token) {
                  navigate("/login");  // Token yoksa login sayfasına yönlendir
              }
          }, [navigate]);  // ✅ `navigate` bağımlılığı eklenmeli.

      // ✅ İzin güncelleme
  const updateEmployeeLeave = (id: number, updatedData: Record<string, any>) => {
  fetch(`http://localhost:9090/v1/dev/employee/leaves/update/${id}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedData),
  })
  .then((res) => res.json())
  .then((data) => {
      console.log("İzin güncellendi:", data);
  })
  .catch((err) => console.error("İzin güncellenirken hata oluştu:", err));
};

// ✅ Yeni bir izin talebi kaydetme
const saveEmployeeLeave = (leaveData: Record<string, any>) => {
  fetch("http://localhost:9090/v1/dev/employee/leaves/save", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(leaveData),
  })
  .then((res) => res.json())
  .then((data) => {
      console.log("Yeni izin kaydedildi:", data);
  })
  .catch((err) => console.error("Yeni izin kaydedilirken hata oluştu:", err));
};

// ✅ Sistemde kayıtlı tüm izin taleplerini listeleme
const fetchEmployeeLeaves = () => {
  fetch("http://localhost:9090/v1/dev/employee/leaves/list", {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
  })
  .then((res) => res.json())
  .then((data) => {
      console.log("İzinler listelendi:", data);
  })
  .catch((err) => console.error("İzinleri listelerken hata oluştu:", err));
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleAddRequest = () => {
    setPermissionRequests([
      ...permissionRequests,
      { ...newRequest, status: 'Pending' as 'Pending' },
    ]);
    setNewRequest({ employeeName: '', date: '', type: '' });
  };

  return (
    <div className="deneme-container">
      <EmployeeSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="permissions-container">
          <h2>İzin Talepleri</h2>

          {/* Yeni izin talebi formu */}
          <div className="new-request-form">
            <h3>Yeni İzin Talebi Ekle</h3>
            <input
              type="text"
              name="employeeName"
              value={newRequest.employeeName}
              placeholder="Çalışan Adı"
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="date"
              value={newRequest.date}
              onChange={handleInputChange}
            />
            <select name="type" value={newRequest.type} onChange={handleInputChange}>
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
            <button onClick={handleAddRequest}>Ekle</button>
          </div>

          {/* İzin talepleri listesi */}
          <div className="requests-list">
            <h3>İzin Talepleri</h3>
            <table>
              <thead>
                <tr>
                  <th>Çalışan Adı</th>
                  <th>Tarih</th>
                  <th>İzin Türü</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {permissionRequests.map((request, index) => (
                  <tr key={index}>
                    <td>{request.employeeName}</td>
                    <td>{request.date}</td>
                    <td>{request.type}</td>
                    <td>{request.status}</td>
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

export default Permissions;
