import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

function Register() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const navigate = useNavigate(); 

  const register = () => {
    if (email === '' || password === '' || rePassword === '') {
      swal('Hata', 'Lütfen tüm alanları doldurunuz', 'error');
      return;
    }
    if (password !== rePassword) {
      swal('Hata', 'Şifreler uyuşmuyor', 'error');
      return;
    }

    fetch('http://localhost:9090/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        rePassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.code === 200) {
          swal('Başarılı', 'Kayıt işlemi başarılı', 'success');
          navigate('/login'); 
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
            <h1>Kayıt Ol</h1>
            <input type="text" placeholder="İsim" onChange={(e) => setFirstName(e.target.value)} />
            <input type="text" placeholder="Soyisim" onChange={(e) => setLastName(e.target.value)} />
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Parola" onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Parola Tekrar" onChange={(e) => setRePassword(e.target.value)} />
            <button type="button" onClick={register}>Kaydet</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-right">
              <h1>Merhaba!</h1>
              <p>Aramıza Hoş Geldiniz</p>
              <button onClick={() => navigate('/login')} className="ghost" id="signUp">Giriş Yap</button>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <p>
          Created with <i className="fa fa-heart"></i> by
          <a target="_blank" href="https://florin-pop.com">Florin Pop</a>
          <a target="_blank" href="https://www.florin-pop.com/blog/2019/03/double-slider-sign-in-up-form/">here</a>.
        </p>
      </footer>
    </div>
  );
}

export default Register;
