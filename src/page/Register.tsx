import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import "./login.css";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const register = async () => {
    const { firstName, lastName, email, password, rePassword } = formData;

    
    if (!firstName || !lastName || !email || !password || !rePassword) {
      swal("Hata", "Lütfen tüm alanları doldurunuz", "error");
      return;
    }

    // Şifre doğrulama
    if (password !== rePassword) {
      swal("Hata", "Şifreler uyuşmuyor", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:9090/v1/dev/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password,rePassword }),
      });

      if (!response.ok) {
        throw new Error("Sunucudan geçersiz yanıt geldi");
      }

      const data = await response.json();
      console.log(data);

      if (data.code === 200) {
        swal("Başarılı", "Kayıt işlemi başarılı", "success");
        navigate("/login");
      } else {
        swal("Hata", data.message, "error");
      }
    } catch (error) {
      console.error("Hata: ", error);
      swal("Hata", "Kayıt işlemi sırasında bir hata oluştu", "error");
    }
  };

  return (
    <div>
      <div className="container" id="container">
        <div className="form-container sign-in-container">
          <form onSubmit={(e) => e.preventDefault()}>
            <h1>Kayıt Ol</h1>
            <input type="text" name="firstName" placeholder="İsim" onChange={handleChange} />
            <input type="text" name="lastName" placeholder="Soyisim" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />
            <input type="password" name="password" placeholder="Parola" onChange={handleChange} />
            <input type="password" name="rePassword" placeholder="Parola Tekrar" onChange={handleChange} />
            <button type="button" onClick={register}>Kaydet</button>
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
              <p>Aramıza Hoş Geldiniz</p>
              <button onClick={() => navigate("/login")} className="ghost" id="signUp">
                Giriş Yap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
