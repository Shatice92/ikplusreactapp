import { withTranslation } from "react-i18next";
import type { TFunction } from 'i18next';
import { Container, TextWrapper, Content } from "./styles";

interface BlockProps {
  title: string;
  content: string;
  t: TFunction;
}

const Block = ({ title, content, t }: BlockProps) => {
  return (
    <Container>
      <h6>{t(title)}</h6>
      <TextWrapper>
        <Content>{t(content)}</Content>
      </TextWrapper>
    </Container>
  );
};

export default withTranslation()(Block);
