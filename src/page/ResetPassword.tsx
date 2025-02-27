import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './resetpassword.css';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  // Token'ı URL'den al
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Geçersiz bağlantı.");
    }
  }, [token]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (newPassword !== confirmPassword) {
      setError("Şifreler uyuşmuyor.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:9090/v1/dev/password/reset?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Şifreniz başarıyla sıfırlandı!");
      } else {
        setError(data.message || "Şifre sıfırlama başarısız oldu.");
      }
    } catch (error) {
      console.error("Şifre sıfırlama hatası:", error);
      setError("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };
  

  return (
    <div className="reset-password-container">
      <h2>Yeni Parola Belirleyin</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleResetPassword}>
        <div className="input-container">
          <input
            type="password"
            placeholder="Yeni Parola"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-container">
          <input
            type="password"
            placeholder="Yeni Parolayı Tekrar Girin"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="reset-button">Şifreyi Sıfırla</button>
      </form>
    </div>
  );
};

export default ResetPassword;
