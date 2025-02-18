import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      swal("Hata", "Lütfen tüm alanları doldurunuz", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:9090/v1/dev/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Sunucu hatası");
      }

      const data = await response.json();

      if (data.code === 200) {
        swal("Başarılı", "Giriş başarılı!", "success");
        sessionStorage.setItem("token", data.data.token);
        navigate("/homepage");
      } else {
        swal("Hata", data.message || "Bilinmeyen bir hata oluştu", "error");
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
      swal("Hata", "Giriş yapılırken bir hata oluştu, tekrar deneyin.", "error");
    }
  };

  return (
    <div className="container">
      <div className="form-container sign-in-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <h1>Giriş Yap</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={handleLogin}>
            Giriş Yap
          </button>
          <p>
            <a onClick={() => navigate("/resetpassword")} className="forgot-password-link">
              Parolanızı mı unuttunuz?
            </a>
          </p>
        </form>
      </div>

      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-right">
            <div className="circles-container">
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <img src="/favicon.ico" alt="Logo" className="circle-icon" />
            </div>
            <h1>Merhaba!</h1>
            <p>Hesabınız yoksa lütfen kayıt olunuz.</p>
            <button onClick={() => navigate("/register")} className="ghost">
              Kayıt Ol
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
