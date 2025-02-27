import { Row, Col } from "antd";
import { withTranslation } from "react-i18next";
import { Slide } from "react-awesome-reveal";
import { ContactProps, ValidationTypeProps } from "./types";
import { useForm } from "../../common/utils/useForm";
import validate from "../../common/utils/validationRules";
import { Button } from "../../common/Button";
import Block from "../Block";
import Input from "../../common/Input";
import TextArea from "../../common/TextArea";
import { ContactContainer, FormGroup, Span, ButtonContainer, InputField } from "./styles";
import { TFunction } from "i18next";

interface ContactFormProps {
  t: TFunction<"translation">;
}

const Contact = ({ title, content, id, t }: ContactProps) => {
  const { values, errors, handleChange, handleSubmit } = useForm(validate);

  const ValidationType = ({ type }: ValidationTypeProps) => {
    const ErrorMessage = errors[type as keyof typeof errors];
    return <Span>{ErrorMessage}</Span>;
  };

  return (
    <ContactContainer id={id}>
      <Row justify="space-between" align="middle">
        <Col lg={12} md={12} sm={24} xs={24}>
          <Slide direction="left" triggerOnce>
            <Block title={title} content={content} />
          </Slide>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Slide direction="right" triggerOnce>
            <FormGroup autoComplete="off" onSubmit={handleSubmit}>
              <Col span={24}>
                <InputField>
                  <Input
                    type="text"
                    name="Ad"
                    placeholder={t("Adınız")}
                    value={values.name || ""}
                    onChange={handleChange}
                  />
                  <ValidationType type="name" />
                </InputField>
              </Col>
              <Col span={24}>
                <InputField>
                  <Input
                    type="email"
                    name="email"
                    placeholder={t("Mail Adresiniz")}
                    value={values.email || ""}
                    onChange={handleChange}
                  />
                  <ValidationType type="email" />
                </InputField>
              </Col>
              <Col span={24}>
                <InputField>
                  <TextArea
                    placeholder={t("Mesajınız")}
                    value={values.message || ""}
                    name="mesaj"
                    onChange={handleChange}
                  />
                  <ValidationType type="message" />
                </InputField>
              </Col>
              <ButtonContainer>
                <Button name="submit">{t("Gönder")}</Button>
              </ButtonContainer>
            </FormGroup>
          </Slide>
        </Col>
      </Row>
    </ContactContainer>
  );
};

export default withTranslation()(Contact);