import { lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { HomeStyles, DefaultStyles } from "./styles/styles"; // Import yaptık
import ForgotPassword from "./page/ForgotPassword";
import UserProfileEdit from "./page/UserProfileEdit";
import UserProfile from "./page/UserProfile";
import PersonalManagementPage from "./page/PersonalManagementPage";
import TestPage from './page/TestPage';
// Lazy loaded pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./page/Login"))
const Register = lazy(() => import("./page/Register"));

const RouterPage = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      // Eğer bölüm yoksa (başka sayfadaysa), ana sayfaya gidip o bölüme scroll yap
      navigate(`/#${sectionId}`, { replace: true });
    }
  };

  // Dummy user data (bu veriyi backend'den alabilirsiniz)
  const dummyUserData = {
    firstName: "Hatice",
    lastName: "SEYREK",
    email: "hatice@example.com",
    gender: "Kadın",
    phoneNumber: "1234567890",
    birthDate: "1992-11-29",
    maritalStatus: "Evli",
    bloodType: "A+",
    identificationNumber: "12345678901",
    nationality: "Türk",
    educationLevel: "Üniversite",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE"
  };

  const handleSave = (updatedData: any) => {
    // API'ye güncellenmiş veriyi göndermek için burada bir işlem yapılabilir
    console.log("Updated user data:", updatedData);
  };

  return (
    <>
      {/* Default styles tüm sayfalarda geçerli olacak */}
      <DefaultStyles />

      {/* Home sayfasına özel stil */}
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
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/personel" element={<PersonalManagementPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/test" element={<TestPage />} />
          {/* Profil Görüntüleme Sayfası */}
          <Route
            path="/user-profile"
            element={
              <UserProfile
              />
            }
          />
          {/* Profil Düzenleme Sayfası */}
          <Route
            path="/user-profile-edit"
            element={
              <UserProfileEdit
                userData={dummyUserData}
                onSave={handleSave}
              />
            }
          />
        </Routes>
      </Suspense>

      <Footer />
    </>
  );
};

export default RouterPage;
