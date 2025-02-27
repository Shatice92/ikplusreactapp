import React, { useState } from 'react'
import "./login.css"
import { useNavigate } from 'react-router';
import swal from 'sweetalert';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
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
                 // Role bilgisi almak için fetch isteği gönderiyoruz
        const roleResponse = await fetch('http://localhost:9090/v1/dev/user/dashboard', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
          });
  
          const roleData = await roleResponse.json();
          if (roleResponse.ok && roleData.data) {
            const userRole = roleData.data; // Backend'den gelen kullanıcı rolü
            
            // Kullanıcı rolüne göre yönlendirme işlemi
            switch (userRole) {
              case 'ADMIN':
                navigate('/profile');
                break;
              case 'COMPANY_MANAGER':
                navigate('/profile');
                break;
              case 'EMPLOYEE':
                navigate('/profile');
                break;
              case 'WEBSITE_MEMBER':
                navigate('/profile');
                break;
              case 'VISITOR':
                navigate('/login');
                break;
              default:
                navigate('/login');
                break;
            }
          } else {
            swal('Hata', 'Rol bilgisi alınamadı', 'error');
          }
        } else {
          swal('Hata', data.message || 'Bilinmeyen bir hata oluştu', 'error');
        }
      } catch (error) {
        console.error('Giriş hatası:', error);
        swal('Hata', 'Giriş yapılırken bir hata oluştu, tekrar deneyin.', 'error');
      }
    };
    return (
        <div id="login-page">
            <div className="login">
                <a href="/homepage">
                    <img src="/img/svg/logo.svg" width={250} height={250} alt="" />
                </a>
                <form className="form-login" onSubmit={handleLogin}>

                    <label htmlFor="email">Email</label>
                    <div className="input-email">
                        <i className="fas fa-envelope icon"></i>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <label htmlFor="password">Şifre</label>
                    <div className="input-password">
                        <i className="fas fa-lock icon"></i>
                        <input
                            type="password"
                            placeholder="Parola"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="checkbox">
                        <label htmlFor="remember">
                            <input type="checkbox" name="remember" />
                            Beni Hatırla
                        </label>
                    </div>
                    <button type="submit"><i className="fas fa-door-open"></i> Giriş</button>

                    <button type="button" onClick={() => navigate("/register")}><i className="fas fa-key"></i> Kayıt ol</button>
                </form>
                <p>
                    <a onClick={() => navigate("/forgot-password")} className="forgot-password-link">
                        Parolanızı mı unuttunuz?
                    </a>
                </p>
            </div>
            <div className="background">
                <img src="/img/background.jpg" alt="Background" />
            </div>
        </div>
    )
}

export default Login 