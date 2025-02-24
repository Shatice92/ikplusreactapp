import React, { useState } from 'react';
import './CompanyManagerPermissions.css';

interface CompanyManagerPermissionRequest {
  employeeName: string;
  startDate: string;
  endDate: string;
  type: string;
  status: "Pending" | "Approved" | "Rejected";
}
const CompanyManagerPermissions = () => {
  const [companyManagerPermissionRequests, setCompanyManagerPermissionRequests] = useState<
    CompanyManagerPermissionRequest[]
  >([
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

   // Yeni izin ekleme
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRequest(prevState => {
      const updatedRequest = { ...prevState, [name]: value };

      // Başlangıç tarihi bitiş tarihinden sonra ise hata mesajı göster
      if (updatedRequest.startDate && updatedRequest.endDate && updatedRequest.startDate > updatedRequest.endDate) {
        setErrorMessage("Başlangıç tarihi bitiş tarihinden sonra olamaz!");
        updatedRequest.endDate = updatedRequest.startDate; // Hatalı girdiyi düzelt
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

   // İzin Güncelleme İşlemi
   const handleUpdateRequest = () => {
    if (editIndex !== null) {
      const updatedRequests = [...companyManagerPermissionRequests];
      updatedRequests[editIndex] = { ...newRequest, status: updatedRequests[editIndex].status };
      setCompanyManagerPermissionRequests(updatedRequests);
      setEditIndex(null);
      setNewRequest({ employeeName: "", startDate: "", endDate: "", type: "" });
    }
  };

  // İzin Güncelleme Butonuna Basınca Mevcut Verileri Formda Göster
  const handleEditRequest = (index: number) => {
      setEditIndex(index);
      setNewRequest(companyManagerPermissionRequests[index]);
  };

  // İzin Silme İşlemi
  const handleDeleteRequest = (index: number) => {
      setCompanyManagerPermissionRequests(companyManagerPermissionRequests.filter((_, i) => i !== index));
  };

// İzin Onaylama ve Reddetme İşlemleri
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
    <div className="permissions-container">
      <h2>İzin Talepleri</h2>

      {/* Yeni izin talebi formu */}
      <div className="new-request-form">
        <h3>{editIndex !== null ? " İzni Güncelle" : " Yeni İzin Talebi Ekle"}</h3>
        <input type="text" name="employeeName" value={newRequest.employeeName} placeholder="Çalışan Adı" onChange={handleInputChange} />
        <input type="date" name="startDate" value={newRequest.startDate} onChange={handleInputChange} />
        <input type="date" name="endDate" value={newRequest.endDate} onChange={handleInputChange} />
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
        {editIndex !== null ? (
          <button onClick={handleUpdateRequest}>Güncelle</button>
        ) : (
          <button onClick={handleAddRequest}>Ekle</button>
        )}
      </div>

      {/* İzin talepleri listesi */}
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
                  {request.status === "Pending" && (
                    <>
                      <button onClick={() => handleApprove(index)}>Onayla</button>
                      <button onClick={() => handleReject(index)}>Reddet</button>
                    </>
                  )}
                  <button onClick={() => handleEditRequest(index)}>Düzenle</button>
                  <button onClick={() => handleDeleteRequest(index)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyManagerPermissions;