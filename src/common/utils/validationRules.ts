import { validateProps } from "../../common/types";

export default function validate(values: validateProps) {
  let errors = {} as validateProps;

  if (!values.name) {
    errors.name = "İsim boş bırakılamaz";
  }
  if (!values.email) {
    errors.email = "Email boş bırakılamaz";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email addres geçersiz";
  }
  if (!values.message) {
    errors.message = "Mesaj boş bırakılamaz";
  }
  return errors;
}
