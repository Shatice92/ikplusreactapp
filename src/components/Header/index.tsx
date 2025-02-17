import { useState } from "react";
import { Row, Col, Drawer } from "antd";
import { withTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import type { TFunction } from 'i18next';
import Container from "../../common/Container";
import { SvgIcon } from "../../common/SvgIcon";
import { Button } from "../../common/Button";
import {
  HeaderSection,
  LogoContainer,
  Burger,
  NotHidden,
  Menu,
  CustomNavLinkSmall,
  Label,
  Outline,
  Span,
} from "./styles";

interface HeaderProps {
  t: TFunction;
  scrollToAbout: () => void;
  scrollToMission: () => void;
  scrollToProduct: () => void;
  scrollToContact: () => void;
}

const Header = ({
  t,
  scrollToAbout,
  scrollToMission,
  scrollToProduct,
  scrollToContact
}: HeaderProps) => {
  const [visible, setVisibility] = useState(false);
  const navigate = useNavigate();

  const toggleButton = () => {
    setVisibility(!visible);
  };

  const MenuItem = () => {
    return (
      <>
        <CustomNavLinkSmall
          onClick={scrollToAbout}
          style={{ width: "50px", padding: "50px" }}
        >
          <Span>{t("Hakkımızda")}</Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall onClick={scrollToMission}>
          <Span>{t("Misyonumuz")}</Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall onClick={scrollToProduct}>
          <Span>{t("Ürünlerimiz")}</Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall
          style={{ width: "100px" }}
          onClick={scrollToContact}
        >
          <Span>
            <Button>{t("İletişim")}</Button>
          </Span>
        </CustomNavLinkSmall>

        <CustomNavLinkSmall
          style={{ width: "180px" }}
          onClick={() => navigate('/login')}
        >
          <Span>
            <Button>{t("Giriş Yap")}</Button>
          </Span>
        </CustomNavLinkSmall>

        <CustomNavLinkSmall
          style={{ width: "180px" }}
          onClick={() => navigate('/register')}
        >
          <Span>
            <Button>{t("Kayıt Ol")}</Button>
          </Span>
        </CustomNavLinkSmall>
      </>
    );
  };

  return (
    <HeaderSection>
      <Container>
        <Row justify="space-between">
          <LogoContainer to="/homepage" aria-label="homepage">
            <SvgIcon src="logo.svg" width="250px" height="250px" />
          </LogoContainer>
          <NotHidden>
            <MenuItem />
          </NotHidden>
          <Burger onClick={toggleButton}>
            <Outline />
          </Burger>
        </Row>
        <Drawer closable={false} open={visible} onClose={toggleButton}>
          <Col style={{ marginBottom: "2.5rem" }}>
            <Label onClick={toggleButton}>
              <Col span={12}>
                <Menu>Menu</Menu>
              </Col>
              <Col span={12}>
                <Outline />
              </Col>
            </Label>
          </Col>
          <MenuItem />
        </Drawer>
      </Container>
    </HeaderSection>
  );
};

export default withTranslation()(Header);
