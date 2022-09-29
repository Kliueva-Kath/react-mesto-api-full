import AuthForm from "./AuthForm.js";
import { useState } from "react";

export default function Login({ onLogin, history }) {
  const [values, setValues] = useState({ email: "", password: "" });

  function handleChange(evt) {
    const { value, name } = evt.target;
    setValues({ ...values, [name]: value });
  }

  function handleLogin(evt) {
    evt.preventDefault();
    onLogin(values);
  }
  return (
    <AuthForm
      name="login"
      title="Вход"
      buttonText="Войти"
      onSubmit={handleLogin}
      loadingText="Сохранение..."
    >
      <input
        type="email"
        className="form__input form__input_type_auth"
        id="email-input"
        placeholder="Email"
        minLength="2"
        maxLength="40"
        value={values.email || ""}
        name="email"
        onChange={handleChange}
        required
      />
      <span className="form__input-error name-input-error"></span>
      <input
        type="password"
        className="form__input form__input_type_auth"
        id="password-input"
        placeholder="Пароль"
        minLength="2"
        maxLength="200"
        value={values.password || ""}
        name="password"
        onChange={handleChange}
        required
      />
      <span className="form__input-error job-input-error"></span>
    </AuthForm>
  );
}

//TODO: разобраться с рендерингом при загрузке
