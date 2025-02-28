import { useEffect, useState } from "react";
import EmployeeSidebar from "../components/organisms/EmployeeSideBar";
import { IAssets } from "../model/IAssets";
import './EmployeeAssets.css';

const EmployeeAssets = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [assets, setAssets] = useState<IAssets[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<IAssets | null>(null);
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleToggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };


  useEffect(() => {
    const token = sessionStorage.getItem('token'); 
    if (token) {
      fetch("http://localhost:9090/v1/dev/employee/assets/get-asset-by-employeeId", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            return response.json().then(errorData => {
              throw new Error(errorData.message || 'API error');
            });
          }
        })
        .then(data => {
          if (data.success) {
            setAssets(data.data); // asset'leri state'e kaydet
          } else {
            setErrorMessage(data.message || "API Response Error");
            console.error("API Response Error:", data.message);
          }
        })
        .catch(error => {
          console.error("Asset'leri alırken hata oluştu:", error);
          setErrorMessage(error.message);
        });
    } else {
      console.error("Geçersiz veya eksik token!");
      setErrorMessage("Geçersiz veya eksik token!");
    }
  }, []);

  const handleApprove = (assetId: number) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      fetch(`http://localhost:9090/v1/dev/employee/assets/approve/${assetId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(errorData => {
              throw new Error(errorData.message || 'API error');
            });
          }
          return response.json();
        })
        .then(data => {
          alert("Zimmet onaylandı!");
          setAssets((prev) => prev.filter((asset) => asset.id !== assetId)); // Onaylananı listeden çıkar
        })
        .catch((err) => {
          console.error("Onaylama hatası:", err);
          setErrorMessage("Onaylama işlemi sırasında hata oluştu.");
        });
    }
  };
  

  const handleReject = (assetId: number) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      fetch(`http://localhost:9090/v1/dev/employee/assets/reject/${assetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ note }), // Burada `note`'u backend'e gönderiyoruz
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(errorData => {
              throw new Error(errorData.message || 'API error');
            });
          }
          return response.json();
        })
        .then(data => {
          alert("Reddetme işlemi tamamlandı!");
          setAssets((prev) => prev.filter((asset) => asset.id !== assetId)); // Reddedileni listeden çıkar
        })
        .catch((err) => {
          console.error("Reddetme hatası:", err);
          setErrorMessage("Reddetme işlemi sırasında hata oluştu.");
        });
    }
  };
  

  return (
    <div className="deneme-container">
      <EmployeeSidebar collapsed={collapsed} onToggle={handleToggleSidebar} />
      <div className={`content ${collapsed ? "expanded" : ""}`}>
        <div className="content">
          <h2>Personel Zimmet Listesi</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Hata mesajı */}
          <table className="assets-table">
            <thead>
              <tr>
                <th>Adı</th>
                <th>Seri Numarası</th>
                <th>Atanma Tarihi</th>
                <th>Tür</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {assets.length > 0 ? (
                assets.map((asset) => (
                  <tr key={asset.id}>
                    <td>{asset.name}</td>
                    <td>{asset.serialNumber}</td>
                    <td>{new Date(asset.assignedDate).toLocaleDateString()}</td>
                    <td>{asset.assetType}</td>
                    <td>{asset.status}</td>
                    <td>
                      <button onClick={() => handleApprove(asset.id)} className="approve-btn">
                        Kabul Et
                      </button>
                      <button onClick={() => setSelectedAsset(asset)} className="reject-btn">
                        Geri Gönder
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>Asset bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAssets;
