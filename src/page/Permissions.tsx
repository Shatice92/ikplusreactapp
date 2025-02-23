import React, { useState } from 'react';
import './Permissions.css';

interface PermissionRequest {
  employeeName: string;
  date: string;
  type: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const Permissions = () => {
  const [permissionRequests, setPermissionRequests] = useState<PermissionRequest[]>([
    { employeeName: 'John Doe', date: '2025-03-01', type: 'Sick Leave', status: 'Pending' },
    { employeeName: 'Jane Smith', date: '2025-03-02', type: 'Annual Leave', status: 'Approved' },
    { employeeName: 'Alice Johnson', date: '2025-03-03', type: 'Maternity Leave', status: 'Rejected' },
  ]);
  const [newRequest, setNewRequest] = useState({ employeeName: '', date: '', type: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  const handleAddRequest = () => {
    setPermissionRequests([
      ...permissionRequests,
      { ...newRequest, status: 'Pending' as 'Pending' },
    ]);
    setNewRequest({ employeeName: '', date: '', type: '' });
  };

  const handleApprove = (index: number) => {
    const updatedRequests = [...permissionRequests];
    updatedRequests[index].status = 'Approved';
    setPermissionRequests(updatedRequests);
  };

  const handleReject = (index: number) => {
    const updatedRequests = [...permissionRequests];
    updatedRequests[index].status = 'Rejected';
    setPermissionRequests(updatedRequests);
  };

  return (
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
          <option value="Sick Leave">Hastalık İzni</option>
          <option value="Annual Leave">Yıllık İzin</option>
          <option value="Maternity Leave">Doğum İzni</option>
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
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {permissionRequests.map((request, index) => (
              <tr key={index}>
                <td>{request.employeeName}</td>
                <td>{request.date}</td>
                <td>{request.type}</td>
                <td>{request.status}</td>
                <td>
                  {request.status === 'Pending' && (
                    <>
                      <button onClick={() => handleApprove(index)}>Onayla</button>
                      <button onClick={() => handleReject(index)}>Reddet</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Permissions;