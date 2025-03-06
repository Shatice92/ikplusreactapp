import React, { useEffect, useState } from 'react'
import './AssetsTable.css'
import { IAssets } from '../../model/IAssets';

function CompanyManagerAssetsTable() {
  const [assets, setAssets] = useState<IAssets[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<IAssets | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showModal, setShowModal] = useState(false);


    
    const [newAsset, setNewAsset] = useState({
      employeeId: "",
      name: "",
      serialNumber: "",
      assetType: "",
      
    });


    useEffect(() => {
      fetchAssets();
    }, []);
  
    const fetchAssets = () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setErrorMessage("Geçersiz veya eksik token!");
        return;
      }
  
      fetch("http://localhost:9090/v1/dev/company-manager/assets/list", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) setAssets(data.data);
          else setErrorMessage(data.message || "API Response Error");
        })
        .catch((error) => setErrorMessage(error.message));
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setNewAsset({ ...newAsset, [e.target.name]: e.target.value });
    };
  
    const handleSaveAsset = () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setErrorMessage("Geçersiz veya eksik token!");
        return;
      }
  
      fetch("http://localhost:9090/v1/dev/company-manager/assets/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAsset),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            fetchAssets(); // Yeni veriyi yükle
            setShowModal(false); // Modalı kapat
            setNewAsset({ employeeId: "", name: "", serialNumber: "",  assetType: ""}); // Formu sıfırla
          } else {
            setErrorMessage(data.message || "Zimmet eklenirken hata oluştu!");
          }
        })
        .catch((error) => setErrorMessage(error.message));
    };
  
    return (
      <div className="container">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-6">
                <h2>Zimmet Yönetimi</h2>
              </div>
              <div className="col-sm-6">
                <button className="btn btn-success" onClick={() => setShowModal(true)}>Yeni Zimmet Ekle</button>
              </div>
            </div>
          </div>
  
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Çalışan id</th>
                <th>Zimmet Adı</th>
                <th>Atanma Tarihi</th>
                <th>Zimmet Türü</th>
                <th>Seri Numarası</th>
                <th>Teslim Tarihi</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {assets.length > 0 ? (
                assets.map((asset) => (
                  <tr key={asset.employeeId}>
                    <td>{asset.employeeId}</td>
                    <td>{asset.name}</td>
                    <td>{new Date(asset.assignedDate).toLocaleDateString()}</td>
                    <td>{asset.assetType}</td>
                    <td>{asset.serialNumber}</td>
                    <td>{asset.dueDate}</td>
                    <td>{asset.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>Asset bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
  
        {/* Modal */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
              <h2>Yeni Zimmet Ekle</h2>
              <input type="text" name="employeeId" placeholder="Çalışan ID" value={newAsset.employeeId} onChange={handleInputChange} />
              <input type="text" name="name" placeholder="Zimmet Adı" value={newAsset.name} onChange={handleInputChange} />
              <input type="text" name="serialNumber" placeholder="Seri No" value={newAsset.serialNumber} onChange={handleInputChange} />
              <select name="assetType" value={newAsset.assetType} onChange={handleInputChange}>
                <option value="">Zimmet Türü Seç</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Mobilya">Mobilya</option>
              </select>
              <button className="btn btn-primary" onClick={handleSaveAsset}>Kaydet</button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  export default CompanyManagerAssetsTable;