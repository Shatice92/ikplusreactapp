import { createGlobalStyle } from "styled-components";

export const Styles = createGlobalStyle`


@keyframes slideIn {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(0); }
}

.slide-in {
    animation: slideIn 0.5s ease-out;
}

svg {
    transition: transform 0.3s ease, fill 0.3s ease;
}

svg:hover {
    transform: scale(1.1);
    fill: #ff416c;
}


    @font-face {
        font-family: "Motiva Sans Light";
        src: url("/fonts/Motiva-Sans-Light.ttf") format("truetype");
        font-style: normal;
    }

    @font-face {
        font-family: "Motiva Sans Bold";
        src: url("/fonts/Motiva-Sans-Bold.ttf") format("truetype");
        font-style: normal;
    }


    body,
    html,
    a {
        font-family: 'Motiva Sans Light', sans-serif;
    }


    body {
        margin:0;
        padding:0;
        border: 0;
        outline: 0;
        background: #fff;
        overflow-x: hidden;
    }

    a:hover {
        color: #18216d;
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

    h1 {
        font-weight: 600;
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
