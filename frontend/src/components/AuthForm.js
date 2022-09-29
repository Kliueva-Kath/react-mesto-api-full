export default function AuthForm({
  name,
  title,
  children,
  buttonText,
  onSubmit,
  isLoading,
  loadingText,
}) {
  return (
    <div className="auth-form">
      <h2 className="auth-form__header">{title}</h2>
      <form className="form" name={`${name}-form`} onSubmit={onSubmit}>
        {children}
        <button
          className="button form__save-button form__save-button_type_auth"
          type="submit"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
}
