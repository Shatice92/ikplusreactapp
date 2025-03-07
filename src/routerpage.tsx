import { lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { HomeStyles, DefaultStyles } from "./styles/styles"; 
import ForgotPassword from "./page/ForgotPassword";
import UserProfile from "./page/UserProfile";
import CompanyManagement from "./page/CompanyManagement";
import CompanyManagerPermissions from "./page/CompanyManagerPermissions";
import Permissions from "./page/Permissions"; 
import ResetPassword from "./page/ResetPassword";
import EmployeeAssets from "./page/EmployeeAssets";
import AssetsTable from "./components/organisms/EmployeeAssetsTable";
import CompanyManagerAssetManagement from "./page/CompanyManagerAssetManagement";

// Lazy loaded pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./page/Login"));
const Register = lazy(() => import("./page/Register"));
const Comments = lazy(() => import("./page/Comments")); // Lazy yükleme ekledik

const RouterPage = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${sectionId}`, { replace: true });
    }
  };

  const handleSave = (updatedData: any) => {
    console.log("Updated user data:", updatedData);
  };

  return (
    <>
      <DefaultStyles />

      <Routes>
        <Route path="/homepage" element={<HomeStyles />} />
      </Routes>

      <Header
        scrollToAbout={() => scrollToSection("about")}
        scrollToMission={() => scrollToSection("mission")}
        scrollToProduct={() => scrollToSection("product")}
        scrollToContact={() => scrollToSection("contact")}
      />

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/homepage" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/company" element={<CompanyManagement />} />
          <Route path="/assets" element={<AssetsTable />} />
          <Route path="/employee-assets" element={<EmployeeAssets />} />
          <Route path="/companymanager-assets" element={<CompanyManagerAssetManagement />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/companymanager-leaves" element={<CompanyManagerPermissions />} />
          <Route path="/comments" element={<Comments />} /> 

          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Suspense>

      <Footer />
    </>
  );
};

export default RouterPage;
