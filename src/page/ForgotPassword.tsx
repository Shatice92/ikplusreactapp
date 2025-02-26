import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './forgotpassword.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:9090/v1/dev/password/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!");
      } else {
        alert(data.message || "Şifre sıfırlama talebi başarısız oldu.");
      }
    } catch (error) {
      console.error("Şifre sıfırlama hatası:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="deneme-container">
      <div className="forgot-password-container">
        <h2>Parolanızı mı unuttunuz?</h2>
        <p>E-posta adresinizi girin, size parola sıfırlama bağlantısı gönderelim.</p>

        <form onSubmit={handleResetPassword}>
          <div className="input-container">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="button-container">
            <button type="submit" className="reset-button">Sıfırlama Bağlantısını Gönder</button>
            <button type="button" className="back-button" onClick={() => navigate("/login")}>
              Giriş Sayfasına Dön
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
