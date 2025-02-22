import { Row, Col } from "antd";
import { useTranslation } from "react-i18next"; // useTranslation import edildi
import { SvgIcon } from "../../common/SvgIcon";
import Container from "../../common/Container";
import i18n from "i18next";
import { useLocation } from 'react-router-dom'; // useLocation import edildi
import {
  FooterSection,
  Title,
  NavLink,
  Extra,
  LogoContainer,
  Para,
  Large,
  Chat,
  Empty,
  FooterContainer,
  Language,
  Label,
  LanguageSwitch,
  LanguageSwitchContainer,
} from "./styles";

interface SocialLinkProps {
  href: string;
  src: string;
}

const Footer = () => {
  const { t } = useTranslation(); // useTranslation ile çeviri fonksiyonu alındı
  const location = useLocation(); // Geçerli sayfa URL'sini almak için

  // Footer'ı sadece '/homepage' sayfasında göstermek için koşul ekliyoruz
  if (location.pathname !== '/homepage') {
    return null; // Eğer '/homepage' değilse, Footer render edilmez
  }

  const handleChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  const SocialLink = ({ href, src }: SocialLinkProps) => {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        key={src}
        aria-label={src}
      >
        <SvgIcon src={src} width="25px" height="25px" />
      </a>
    );
  };

  return (
    <>
      <FooterSection>
        <Container>
          <Row justify="space-between">
            HEAD
            <Col lg={10} md={10} sm={12} xs={12}>
              <Language>{t("İletişim")}</Language>
              <Large to="/">{t("Bizimle paylaşın")}</Large>
              <Para>{t("Herhangi bir sorunuz mu var?")}</Para>
              <a href="mailto:l.qqbadze@gmail.com">
                <Chat>{t("Bizimle İletişime Geçin")}</Chat>
              </a>
            </Col>
            <Col lg={8} md={8} sm={12} xs={12}>
              <Title>{t("Politikamız")}</Title>
              <Large to="/">{t("Uygulama Güvenliğimiz")}</Large>
              <Large to="/">{t("Yazılım İlkelerimiz")}</Large>
            </Col>
            <Col lg={6} md={6} sm={12} xs={12}>
              <Empty />
              <Large to="/">{t("Destek Merkezimiz")}</Large>
              <Large to="/">{t("Müşteri Desteğimiz")}</Large>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col lg={10} md={10} sm={12} xs={12}>
              <Empty />
              <Language>{t("Adres")}</Language>
              <Para>ATATÜRK</Para>
              <Para>1881.cd</Para>
              <Para>Ankara</Para>
            </Col>
            <Col lg={8} md={8} sm={12} xs={12}>
              <Title>{t("Şirketimiz")}</Title>
              <Large to="/">{t("Hakkımızda")}</Large>
              <Large to="/">{t("Blog")}</Large>
              <Large to="/">{t("Basında Biz")}</Large>
              <Large to="/">{t("Kariyer & Kültür")}</Large>
            </Col>
            <Col lg={6} md={6} sm={12} xs={12}>
              <Label htmlFor="select-lang">{t("Diğer Diller")}</Label>
              <LanguageSwitchContainer>
                <LanguageSwitch onClick={() => handleChange("en")}>
                  <SvgIcon src="united-states.svg" aria-label="homepage" width="30px" height="30px" />
                </LanguageSwitch>
                <LanguageSwitch onClick={() => handleChange("es")}>
                  <SvgIcon src="spain.svg" aria-label="homepage" width="30px" height="30px" />
                </LanguageSwitch>
              </LanguageSwitchContainer>
            <Col lg={8} md={8} sm={12} xs={12}>
              <Title>{t("İletişim")}</Title>
              <Large to="/">{t("Herhangi bir sorunuz mu var?")}</Large>
              <a href="mailto:contact@ikplus.com">
                <Chat>{t("Sohbete Başla")}</Chat>
              </a>
            </Col>
            <Col lg={8} md={8} sm={12} xs={12}>
              <Title>{t("Politika")}</Title>
              <Large to="/">{t("Uygulama Güvenliği")}</Large>
              <Large to="/">{t("Yazılım İlkeleri")}</Large>
            </Col>
            <Col lg={8} md={8} sm={12} xs={12}>
              <Title>{t("Yardım")}</Title>
              <Large to="/">{t("Destek Merkezi")}</Large>
              <Large to="/">{t("Müşteri Desteği")}</Large>
            </Col>
            <Col lg={8} md={8} sm={12} xs={12}>
              <Empty />
              <Title>{t("Adres")}</Title>
              <Large to="/">{t("Maslak, İstanbul")}</Large>
              <Large to="/">{t("+90 (212) 123 45 67")}</Large>
            </Col>
            <Col lg={8} md={8} sm={12} xs={12}>
              <Title>{t("Şirket")}</Title>
              <Large to="/">{t("Hakkımızda")}</Large>
              <Large to="/">{t("Blog")}</Large>
              <Large to="/">{t("")}</Large>
              <Large to="/">{t("Kariyer ve Eğitim")}</Large>
            main
            </Col>
          </Row>
        </Container>
      </FooterSection>
      <Extra>
        <Container border={true}>
          <Row justify="space-between" align="middle" style={{ paddingTop: "3rem" }}>
            <NavLink to="/homepage">
              <LogoContainer>
                <SvgIcon src="logo.svg" aria-label="homepage" width="150px" height="100px" />
              </LogoContainer>
            </NavLink>
            <FooterContainer>
              <SocialLink href="https://github.com/Adrinlol/create-react-app-adrinlol" src="github.svg" />
              <SocialLink href="https://twitter.com/Adrinlolx" src="twitter.svg" />
              <SocialLink href="https://www.linkedin.com/in/lasha-kakabadze/" src="linkedin.svg" />
              <SocialLink href="https://medium.com/@lashakakabadze/" src="medium.svg" />
              <a href="https://ko-fi.com/Y8Y7H8BNJ" target="_blank" rel="noopener noreferrer">
                <img height="36" style={{ border: 0, height: 36 }} src="https://storage.ko-fi.com/cdn/kofi3.png?v=3" alt="Buy Me a Coffee at ko-fi.com" />
              </a>
            </FooterContainer>
          </Row>
        </Container>
      </Extra>
    </>
  );
};

export default Footer;
