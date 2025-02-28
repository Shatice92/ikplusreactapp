import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./i18n"; // i18n konfigürasyonunu import et
import RouterPage from "./routerpage"; // Routing sayfamızı içe aktardık

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <RouterPage />
    </BrowserRouter>
  </React.StrictMode>
);