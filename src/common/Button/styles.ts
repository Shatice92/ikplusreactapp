import styled from "styled-components";

export const StyledButton = styled("button")<{ color?: string }>`
  background: ${(p) => p.color || "#ff416c"};
  color: ${(p) => (p.color ? "#ff416c" : "#fff")};
  font-size: 1rem;
  font-weight: 700;
  width: 100%;
  border: 1px solid #edf3f5;
  border-radius: 30px;
  padding: 13px ;
  cursor: pointer;
  margin-top: 0.625rem;
  max-width: 180px;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 16px 30px rgb(23 31 114 / 20%);
  margin-left: 0px;

  &:hover,
  &:active,
  &:focus {
    color: #fff;
    border: 1px solid #ff4b2b;
    background-color: #ff4b2b;
  }
`;
