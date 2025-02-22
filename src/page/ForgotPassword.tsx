import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './forgotpassword.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Şifre sıfırlama talebi gönderildi:", email);
    // Burada API'ye şifre sıfırlama isteği gönderilebilir
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
