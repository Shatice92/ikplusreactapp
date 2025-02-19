import React, { useState, useEffect } from 'react';
import './UserProfileEdit.css';

interface UserProfileProps {
  userData: {
    educationLevel: string;
    gender: string;
    phoneNumber: string;
    birthDate: string;
    maritalStatus: string;
    bloodType: string;
    identificationNumber: string;
    nationality: string;
  };
  onSave: (updatedData: any) => void;
}

const UserProfileEdit: React.FC<UserProfileProps> = ({ userData, onSave }) => {
  const [formData, setFormData] = useState(userData);

  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);  // Güncellenmiş veriyi parent component'e gönder
  };

  return (
    <div className="user-profile-container">
      <h2>Kişisel Bilgileriniz</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="educationLevel">Eğitim Seviyesi</label>
          <select
            name="educationLevel"
            id="educationLevel"
            value={formData.educationLevel}
            onChange={handleSelectChange}
          >
            <option value="Lise">Lise</option>
            <option value="Üniversite">Üniversite</option>
            <option value="Yüksek Lisans">Yüksek Lisans</option>
            <option value="Doktora">Doktora</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="gender">Cinsiyet</label>
          <select
            name="gender"
            id="gender"
            value={formData.gender}
            onChange={handleSelectChange}
          >
            <option value="Erkek">Erkek</option>
            <option value="Kadın">Kadın</option>
            <option value="Diğer">Diğer</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Telefon Numarası</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="birthDate">Doğum Tarihi</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="maritalStatus">Medeni Durum</label>
          <select
            name="maritalStatus"
            id="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleSelectChange}
          >
            <option value="Evli">Evli</option>
            <option value="Bekar">Bekar</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="bloodType">Kan Grubu</label>
          <select
            name="bloodType"
            id="bloodType"
            value={formData.bloodType}
            onChange={handleSelectChange}
          >
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="O+">O+</option>
            <option value="AB+">AB+</option>
            <option value="A-">A-</option>
            <option value="B-">B-</option>
            <option value="O-">O-</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="identificationNumber">Kimlik Numarası</label>
          <input
            type="text"
            id="identificationNumber"
            name="identificationNumber"
            value={formData.identificationNumber}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nationality">Milliyet</label>
          <input
            type="text"
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="submit-button">Güncelle</button>
      </form>
    </div>
  );
};

export default UserProfileEdit;
