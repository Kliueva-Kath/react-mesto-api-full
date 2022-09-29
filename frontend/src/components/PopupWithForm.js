import { useEffect } from "react";

function PopupWithForm({
  name,
  isOpen,
  title,
  children,
  buttonText,
  onClose,
  onSubmit,
  isLoading,
  loadingText,
}) {
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscClose);
    }
    return () => document.removeEventListener("keydown", handleEscClose);
  }, [isOpen]);

  function handleEscClose(evt) {
    if (evt.key === "Escape") {
      onClose();
    }
  }

  function handleCloseByOverlayClick(evt) {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className={`popup popup_type_${name} ${isOpen && "popup_opened"}`}
      onClick={handleCloseByOverlayClick}
    >
      <div className="popup__container">
        <h2 className="popup__header popup__header_type_form">{title}</h2>
        <form className="form" name={`${name}-form`} onSubmit={onSubmit}>
          {children}
          <button
            className="button form__save-button form__save-button_type_popup"
            type="submit"
          >
            {isLoading ? loadingText : buttonText}
          </button>
        </form>
        <button
          className="button popup__close-icon"
          type="button"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}

export default PopupWithForm;
