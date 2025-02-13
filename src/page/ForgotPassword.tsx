import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate(); // React Router'dan yönlendirme için hook

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Şifre sıfırlama talebi gönderildi:", email);
    // Burada API'ye şifre sıfırlama isteği gönderilebilir
  };

  return (
    <div className="forgot-password-container">
      <h2>Parolanızı mı unuttunuz?</h2>
      <p>E-posta adresinizi girin, size parola sıfırlama bağlantısı gönderelim.</p>

      <form onSubmit={handleResetPassword}>
        <input
          type="email"
          placeholder="E-posta adresiniz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="button-container">
          <button type="submit" className="reset-button">Sıfırlama Bağlantısını Gönder</button>
          <button type="button" className="back-button" onClick={() => navigate("/login")}>
            Giriş Sayfasına Dön
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
