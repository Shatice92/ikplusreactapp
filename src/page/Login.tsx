import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import swal from 'sweetalert';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Yönlendirme için useNavigate hook'u

  

  const login = () => {
    if (email === '' || password === '') {
      swal('Hata', 'Lütfen tüm alanları doldurunuz', 'error');
      return;
    }

    fetch('http://localhost:9090/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.code === 200) {
          swal('Başarılı', 'Giriş başarılı!', 'success');
          navigate('/'); // Başarılı giriş sonrası yönlendirme
        } else {
          swal('Hata', data.message, 'error');
        }
      });
  };

  return (
    <div>
      <div className="container" id="container">
        <div className="form-container sign-in-container">
          <form onSubmit={(e) => e.preventDefault()}>
            <h1>Giriş Yap</h1>
            <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Parola" />
            <a onClick={() => navigate('/resetpassword')} className="forgot-password-link">Parolanızı mı unuttunuz?</a>
            <button type="button" onClick={login}>Giriş</button>
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
              <button onClick={() => navigate('/register')} className="ghost" id="signUp">Kayıt Ol</button>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <p>
          Created with <i className="fa fa-heart"></i> by
          <a target="_blank" rel="noreferrer" href="https://florin-pop.com">Florin Pop</a>
          <a target="_blank" rel="noreferrer" href="https://www.florin-pop.com/blog/2019/03/double-slider-sign-in-up-form/">here</a>.
        </p>
      </footer>
    </div>
  );
}

export default Login;
