import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import { useNavigate } from 'react-router';
import { IUserProfileProps, UserStatus } from '../model/IUserProfileProps';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/organisms/CompanyManagerSidebar';
import AdminSideBar from '../components/organisms/AdminSideBar';
import CompanyManagerSidebar from '../components/organisms/CompanyManagerSidebar';
import EmployeeSideBar from '../components/organisms/EmployeeSideBar';

type RoleName = "ADMIN" | "COMPANY_MANAGER" | "EMPLOYEE" | "VISITOR" | "WEBSITE_MEMBER";


const UserProfile = () => {
  
  const navigate = useNavigate();
  const [userData, setUserData] = useState<IUserProfileProps["userData"] | null>(null);
  const [editableData, setEditableData] = useState<IUserProfileProps["userData"] | null>(null);
  const [bloodTypes, setBloodTypes] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<RoleName | null>(null);


  const [recentActions, setRecentActions] = useState([
    { id: 1, action: "Profil bilgileri güncellendi", date: new Date().toLocaleString() },
    { id: 2, action: "Yeni görev eklendi", date: new Date().toLocaleString() },
    { id: 3, action: "Şifre değiştirildi", date: new Date().toLocaleString() },
    { id: 4, action: "Yeni mesaj alındı", date: new Date().toLocaleString() },
    { id: 5, action: "İzin talebi onaylandı", date: new Date().toLocaleString() },
    { id: 6, action: "Hesap durumu değiştirildi", date: new Date().toLocaleString() }
  ]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Kullanıcı bilgilerini çekme
    fetch("http://localhost:9090/v1/dev/user/get-profile-by-token", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          setUserData(data.data);
          setEditableData(data.data);
        } else {
          console.error("Profil verisi alınamadı");
        }
      })
      .catch((err) => console.error("Profil yüklenirken hata oluştu:", err));

    // Kullanıcı rolünü çekme
    // Kullanıcı rolünü çekme
    fetch("http://localhost:9090/v1/dev/user/dashboard", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((roleData) => {
        if (roleData.code === 200) {
          setUserRole(roleData.data);
        } else {
          console.error("Rol bilgisi alınamadı");
        }
      })

    // Kan grubu verisini çekme
    fetch("http://localhost:9090/v1/dev/blood-types")
      .then((res) => res.json())
      .then((response) => {
        console.log("Kan grupları:", response.data); // Kontrol için log ekleyelim
        setBloodTypes(response.data); // "data" içindeki diziye erişiyoruz
      })
      .catch((err) => console.error("Kan grupları yüklenirken hata oluştu:", err));
  }, [navigate]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editableData) {
      setEditableData({ ...editableData, [e.target.name]: e.target.value });
    }
  };
  // Sidebar Seçimi
  const renderSidebar = () => {
    if (!userRole || userRole === "VISITOR" || userRole === "WEBSITE_MEMBER") {
      return null; // Visitor ve Website Member için sidebar yok
    }
    switch (userRole) {
      case "ADMIN":
        return <AdminSideBar collapsed={collapsed} onToggle={handleToggleSidebar} />;
      case "COMPANY_MANAGER":
        return <CompanyManagerSidebar collapsed={collapsed} onToggle={handleToggleSidebar} />;
      case "EMPLOYEE":
        return <EmployeeSideBar collapsed={collapsed} onToggle={handleToggleSidebar} />;
      default:
        return null;
    }
  };

  const saveChanges = () => {
    if (!editableData) return;

    fetch("http://localhost:9090/v1/dev/user/update-user-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify(editableData),
    })
      .then((res) => res.json())
      .then((updatedData) => {
        setUserData(updatedData);
        setEditableData(updatedData);
        alert("Bilgiler başarıyla güncellendi!");
      })
      .catch((err) => console.error("Güncelleme hatası:", err));
  };

  const toggleAccountStatus = () => {
    if (!editableData) return;

    const newStatus = editableData.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    fetch("http://localhost:9090/v1/dev/user/update-status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: newStatus, userId: editableData.id }),
    })
      .then((res) => res.json())
      .then(() => {
        // Durum değiştirildikten sonra kullanıcı verisini güncelle
        setEditableData({ ...editableData, status: newStatus === "ACTIVE" ? UserStatus.ACTIVE : UserStatus.INACTIVE });
        alert(`Hesap ${newStatus === "ACTIVE" ? "aktifleştirildi" : "donduruldu"}`);
      })
      .catch((err) => console.error("Hesap durumu güncellenirken hata oluştu:", err));
  };
  const handleToggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };


  return (
    <div className="deneme-container">

      <section className="bg-light py-3 py-md-5 py-xl-8">


        <div className="container profile-container">
          {renderSidebar()} {/* Dinamik olarak Sidebar render ediliyor */}

          <div className="user-card">
            <div className="user-card-header"></div>
            <div className="card-img-container">
              <img
                src="https://picsum.photos/200/200"
                className="user-profile-img"
                alt="Profil Resmi"
              />
            </div>
            <div className="card-body">
              <h5 className="welcome-title">Merhaba, {userData?.firstName}</h5>
              <p className="welcome-description">Hesabınız başarıyla oluşturuldu. Lütfen bilgilerinizi güncelleyin!</p>
              {/* Son İşlemler Alanı */}
              {/* Son İşlemler Alanı */}
              <div className="recent-actions">
                <h6>Son İşlemler</h6>
                <ul>
                  {recentActions.map((action) => (
                    <li key={action.id}>
                      <span className="action-date">{action.date}</span> - {action.action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {editableData && (
            <div className="profile-info">
              <h2>Kişisel Bilgileriniz</h2>
              <ul className="profile-details">
                <li><strong>Ad:</strong> <input type="text" name="firstName" value={editableData.firstName} readOnly /></li>
                <li><strong>Soyad:</strong> <input type="text" name="lastName" value={editableData.lastName} readOnly /></li>
                <li><strong>E-posta:</strong> <input type="email" name="email" value={editableData.email} readOnly /></li>
                <li>
                  <strong>Cinsiyet:</strong>
                  <select name="gender" value={editableData.gender} onChange={handleChange}>
                    <option >Seçim Yapınız</option>
                    <option value="KADIN">KADIN</option>
                    <option value="ERKEK">ERKEK</option>
                  </select>
                </li>
                <li><strong>Telefon Numarası:</strong> <input type="text" name="phoneNumber" value={editableData.phoneNumber} onChange={handleChange} /></li>
                <li><strong>Doğum Tarihi:</strong> <input type="date" name="birthDate" value={editableData.birthDate} onChange={handleChange} /></li>
                <li>
                  <strong>Medeni Durum:</strong>
                  <select name="maritalStatus" value={editableData.maritalStatus} onChange={handleChange}>
                    <option >Seçim Yapınız</option>
                    <option value="BEKAR">BEKAR</option>
                    <option value="EVLI">EVLİ</option>
                  </select>
                </li>
                <li>
                  <strong>Kan Grubu:</strong>
                  <select name="bloodType" value={editableData?.bloodType || ""} onChange={handleChange}>
                    <option >Seçim Yapınız</option>
                    {bloodTypes.length > 0 ? (
                      bloodTypes.map((type) => (
                        <option key={type} value={type}>{type.replace("_", " ")}</option>
                      ))
                    ) : (
                      <option disabled>Yükleniyor...</option>
                    )}
                  </select>

                </li>

                <li><strong>Kimlik Numarası:</strong> <input type="text" name="identificationNumber" value={editableData.identificationNumber} onChange={handleChange} /></li>
                <li><strong>Milliyet:</strong> <input type="text" name="nationality" value={editableData.nationality} onChange={handleChange} /></li>
                <li>
                  <strong>Eğitim Seviyesi:</strong>
                  <select name="educationLevel" value={editableData.educationLevel} onChange={handleChange}>
                    <option >Seçim Yapınız</option>
                    <option value="ILKOKUL">İLKOKUL</option>
                    <option value="ORTAOKUL">ORTAOKUL</option>
                    <option value="LISE">LİSE</option>
                    <option value="UNIVERSITE">ÜNİVERSİTE</option>
                    <option value="YUKSEK_LISANS">YÜKSEK LİSANS</option>
                  </select>
                </li>
              </ul>

              <button onClick={saveChanges} className="edit-profile-button">
                Değişiklikleri Kaydet
              </button>
              <button onClick={toggleAccountStatus} className={editableData.status === "ACTIVE" ? "deactivate-button" : "activate-button"}>
                {editableData.status === "ACTIVE" ? "Hesabı Dondur" : "Hesabı Aktifleştir"}
              </button>
           
            </div>
          )}

        </div>

      </section>

    </div>
  );
};

export default UserProfile;