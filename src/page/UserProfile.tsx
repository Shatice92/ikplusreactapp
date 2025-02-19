import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender: string;
    phoneNumber: string;
    birthDate: string;
    maritalStatus: string;
    bloodType: string;
    identificationNumber: string;
    nationality: string;
    educationLevel: string;
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {
  const navigate = useNavigate(); // useNavigate hook'unu burada kullanıyoruz.

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <div className="profile-photo">
          <img 
            src="https://randomuser.me/api/portraits/women/10.jpg" // Mock profil fotoğrafı
            alt="User Profile" 
            className="profile-image" 
          />
        </div>
        <div className="profile-info">
          <h2>Kişisel Bilgileriniz</h2>
          <ul className="profile-details">
            <li><strong>Ad:</strong> {userData.firstName}</li>
            <li><strong>Soyad:</strong> {userData.lastName}</li>
            <li><strong>E-posta:</strong> {userData.email}</li>
            <li><strong>Şifre:</strong> {userData.password}</li> {/* Şifreyi burada göstermek genelde güvenlik açısından önerilmez */}
            <li><strong>Cinsiyet:</strong> {userData.gender}</li>
            <li><strong>Telefon Numarası:</strong> {userData.phoneNumber}</li>
            <li><strong>Doğum Tarihi:</strong> {userData.birthDate}</li>
            <li><strong>Medeni Durum:</strong> {userData.maritalStatus}</li>
            <li><strong>Kan Grubu:</strong> {userData.bloodType}</li>
            <li><strong>Kimlik Numarası:</strong> {userData.identificationNumber}</li>
            <li><strong>Milliyet:</strong> {userData.nationality}</li>
            <li><strong>Eğitim Seviyesi:</strong> {userData.educationLevel}</li>
          </ul>
        </div>
      </div>
      <button onClick={() => navigate('/user-profile-edit')} className="edit-profile-button">
        Profil Düzenle
      </button>
    </div>
  );
};

export default UserProfile;
