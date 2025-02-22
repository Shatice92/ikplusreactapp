import styled from "styled-components";

export const ContactContainer = styled("div")`
  padding: 5rem 0;

  @media only screen and (max-width: 1024px) {
    padding: 3rem 0;
  }
`;

export const FormGroup = styled("form")`
  width: 100%;
  max-width: 520px;
  margin: 0 auto;

  @media only screen and (max-width: 1045px) {
    max-width: 100%;
    margin-top: 2rem;
  }
`;

export const Span = styled("span")`
  display: block;
  font-weight: 600;
  color: rgb(255, 130, 92);
  font-size: 0.875rem;
  margin-top: 5px;
  padding-left: 5px;
`;

export const ButtonContainer = styled("div")`
  text-align: end;
  position: relative;

  @media only screen and (max-width: 414px) {
    padding-top: 0.75rem;
  }
`;

export const InputField = styled("div")`
  margin-bottom: 10px;
  position: relative;

  input,
  textarea {
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 16px;
    box-sizing: border-box;
    transition: all 0.3s;

    &:focus {
      border-color: #ff8533;
      outline: none;
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  .ant-input {
    border-radius: 8px;
  }
`;

