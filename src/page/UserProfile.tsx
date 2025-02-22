import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import { useNavigate } from 'react-router';
import { IUserProfileProps } from '../model/IUserProfileProps';


const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<IUserProfileProps["userData"] | null>(null);
  const [editableData, setEditableData] = useState<IUserProfileProps["userData"] | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

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
  }, [navigate]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editableData) {
      setEditableData({ ...editableData, [e.target.name]: e.target.value });
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


  return (
    <div className="deneme-container">
      <section className="bg-light py-3 py-md-5 py-xl-8">
        <div className="container">
          <div className="row justify-content-between" id="header">
            <img src="/img/svg/logo.svg" width={100} height={100} alt="Logo" />
            <span>
              <button onClick={() => { sessionStorage.removeItem("token"); navigate("/login"); }}>
                Çıkış Yap
              </button>
            </span>
          </div>
        </div>

        <div className="container profile-container">
          {/* Kullanıcı Kartı */}
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
            </div>
          </div>

          {/* Kişisel Bilgiler Alanı */}
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
                    <option value="Kadın">Kadın</option>
                    <option value="Erkek">Erkek</option>
                  </select>
                </li>
                <li><strong>Telefon Numarası:</strong> <input type="text" name="phoneNumber" value={editableData.phoneNumber} onChange={handleChange} /></li>
                <li><strong>Doğum Tarihi:</strong> <input type="date" name="birthDate" value={editableData.birthDate} onChange={handleChange} /></li>
                <li>
                  <strong>Medeni Durum:</strong>
                  <select name="maritalStatus" value={editableData.maritalStatus} onChange={handleChange}>
                    <option value="Bekar">Bekar</option>
                    <option value="Evli">Evli</option>
                  </select>
                </li>
                <li>
                  <strong>Kan Grubu:</strong>
                  <select name="bloodType" value={editableData.bloodType} onChange={handleChange}>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </li>

                <li><strong>Kimlik Numarası:</strong> <input type="text" name="identificationNumber" value={editableData.identificationNumber} onChange={handleChange} /></li>
                <li><strong>Milliyet:</strong> <input type="text" name="nationality" value={editableData.nationality} onChange={handleChange} /></li>
                <li>
                  <strong>Eğitim Seviyesi:</strong>
                  <select name="educationLevel" value={editableData.educationLevel} onChange={handleChange}>
                    <option value="İlkokul">ILKOKUL</option>
                    <option value="Ortaokul">ORTAOKUL</option>
                    <option value="Lise">LISE</option>
                    <option value="Üniversite">UNIVERSITE</option>
                    <option value="Yüksek Lisans">YUKSEK_LISANS</option>
                    <option value="Doktora">Doktora</option>
                  </select>
                </li>
              </ul>
              <button onClick={saveChanges} className="edit-profile-button">
                Değişiklikleri Kaydet
              </button>
              <button

                className={editableData.status === "ACTIVE" ? "deactivate-button" : "activate-button"}
              >
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