import React, { useState } from 'react';
import "./registerdeneme.css";
import { useNavigate } from 'react-router';
import swal from 'sweetalert';

function Registerdeneme() {
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
                body: JSON.stringify({ firstName, lastName, email, password, rePassword }),
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
        <div id="login-page">
            <div className="login">
                <a href="/homepage">
                    <img src="/img/svg/logo.svg" width={250} height={250} alt="" />
                </a>
                <div className="form-container sign-in-container">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input type="text" name="firstName" placeholder="İsim" onChange={handleChange} />
                        <input type="text" name="lastName" placeholder="Soyisim" onChange={handleChange} />
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                        <input type="password" name="password" placeholder="Parola" onChange={handleChange} />
                        <input type="password" name="rePassword" placeholder="Parola Tekrar" onChange={handleChange} />
                        <button type="submit" onClick={register}>Kayıt Ol</button>
                        <button type="submit" onClick={() => navigate("/login")} className="ghost" id="signUp">Giriş Yap</button>
                    </form>
                </div>
            </div>
            <div className="background">
                <img src="https://img.freepik.com/free-photo/businessman-touching-red-icon-connected_1232-176.jpg?t=st=1739968543~exp=1739972143~hmac=d005fb9605fcc0a479e002bb6bfccecdb4b62692e2166d9129587831619dd98d&w=1800" alt="Background" />
            </div>
        </div>
    )
}

export default Registerdeneme;
