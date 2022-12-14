import { useEffect, useRef } from "react";
import PopupWithForm from "./PopupWithForm.js";

export default function EditAvatarPopup({
  isOpen,
  onClose,
  onUpdateAvatar,
  isLoading,
}) {
  const avatarInputRef = useRef();

  // установка значения инпута при открытии попапа
  useEffect(() => {
    avatarInputRef.current.value = "";
  }, [isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateAvatar({
      avatar: avatarInputRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name="change-avatar"
      title="Обновить аватар"
      buttonText="Cохранить"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      loadingText="Сохранение..."
    >
      <input
        type="url"
        className="form__input form__input_type_popup"
        id="avatar-url-input"
        name="avatarInput"
        placeholder="Ссылка на фото"
        ref={avatarInputRef}
        required
      />
      <span className="form__input-error avatar-url-input-error"></span>
    </PopupWithForm>
  );
}
