import { createGlobalStyle } from "styled-components";

// Home sayfasına özel stiller
export const HomeStyles = createGlobalStyle`
  /* Home sayfasına özgü stil */
  body {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    background: #fff;
    overflow-x: hidden;
  }

  .user-profile-container {
    display: flex;
    justify-content: center;
    padding: 20px;
    background-color: #f9f9f9;
  }

  .profile-header {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 900px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }

  .profile-photo {
    margin-right: 30px;
  }

  .profile-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  .profile-info {
    flex-grow: 1;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 15px;
    color: #333;
  }

  .profile-details {
    list-style-type: none;
    padding-left: 0;
    margin: 0;
    font-size: 16px;
  }

  .profile-details li {
    margin-bottom: 10px;
  }

  .profile-details strong {
    font-weight: bold;
    color: #007BFF;
  }

  .edit-profile-button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .edit-profile-button:hover {
    background-color: #0056b3;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Motiva Sans Bold', serif;
    color: #ff416c;
    font-size: 3rem; /* 48px */
    line-height: 1.2;
    margin-bottom: 1rem; /* Başlıklar arasındaki boşluğu azaltmak */
    font-weight: 600;
  }

  p {
    font-size: 1.2rem; /* Paragrafların font boyutunu biraz daha küçük yapmak */
    line-height: 1.5;
    margin-bottom: 1rem; /* Paragraflar arasındaki boşluğu azaltmak */
  }

  input,
  textarea,
  button {
    border-radius: 6px;
    border: 1px solid #ccc;
    padding: 0.8rem 1rem; /* Daha küçük padding */
    margin: 0.5rem 0; /* Form elemanları arasındaki boşluğu azaltmak */
    background: #f1f2f3;
    width: 100%;
    transition: all 0.3s ease;
  }

  input:focus,
  textarea:focus,
  button:hover {
    background-color: #2e186a;
    color: white;
    border-color: #2e186a;
  }

  a {
    text-decoration: none;
    outline: none;
    color: #2E186A;

    :hover {
      color: #2e186a;
    }
  }
  
  *:focus {
    outline: none;
  }

  .about-block-image svg {
    text-align: center;
  }

  .ant-drawer-body {
    display: flex;
    flex-direction: column;
    text-align: left;
    padding-top: 1.5rem;
  }

  .ant-drawer-content-wrapper {
    width: 300px !important;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1.5rem; /* Daha küçük boşluklar */
    padding: 1rem; /* Container'a iç boşluk */
  }

  .section {
    flex: 1 1 calc(33.33% - 2rem);
    padding: 1rem; /* Daha küçük iç boşluk */
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    .section {
      flex: 1 1 100%;  /* Ekran küçüldüğünde tüm öğeler alt alta sıralanır */
      padding: 0.5rem; /* Küçük ekranlarda daha az padding */
    }
  }
`;

// Default stiller, tüm sayfalarda geçerli olacak
export const DefaultStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    background: #fff;
  }

  input,
  textarea,
  button {
    border-radius: 6px;
    border: 1px solid #ccc;
    padding: 0.8rem 1rem; /* Daha küçük padding */
    margin: 0.5rem 0; /* Form elemanları arasındaki boşluğu azaltmak */
    background: #f1f2f3;
    width: 100%;
    transition: all 0.3s ease;
  }

  input:focus,
  textarea:focus,
  button:hover {
    background-color: #2e186a;
    color: white;
    border-color: #2e186a;
  }
  
  /* Genel font ve renkler */
  body, html, a {
    font-family: 'Motiva Sans Light', sans-serif;
  }
  
  a {
    text-decoration: none;
    outline: none;
    color: #2E186A;

    :hover {
      color: #2e186a;
    }
  }
  
  *:focus {
    outline: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Motiva Sans Bold', serif;
    color: #ff416c;
    font-size: 3rem;
    line-height: 1.2;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  }
`;
