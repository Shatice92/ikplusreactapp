import { createGlobalStyle } from "styled-components";

// Home sayfasına özel stiller
export const HomeStyles = createGlobalStyle`


.deneme-container {
  min-height: 100vh;
  background: 
      linear-gradient(135deg, rgba(255, 65, 108, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%),
      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff416c' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  padding: 30px 20px;

}
  body {
    margin: 0;
    padding: 0;
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
    padding: 0;
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
    font-size: 3rem;
    line-height: 1.2;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.5;
    margin-bottom: 0.8rem;
  }

  input,
  textarea,
  button {
    border-radius: 6px;
    border: 1px solid #ccc;
    padding: 0.8rem 1rem;
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
    color: #2E186A;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
  }

  .section {
    flex: 1 1 calc(33.33% - 2rem);
    padding: 1rem;
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    .section {
      flex: 1 1 100%;
      padding: 0.5rem;
    }
  }
`;

// Default stiller, tüm sayfalarda geçerli olacak
export const DefaultStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: #fff;
  }

  input,
  textarea,
  button {
    border-radius: 6px;
    border: 1px solid #ccc;
    padding: 0.8rem 1rem;
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
  
  body, html, a {
    font-family: 'Motiva Sans Light', sans-serif;
  }
  
  a {
    text-decoration: none;
    color: #2E186A;
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