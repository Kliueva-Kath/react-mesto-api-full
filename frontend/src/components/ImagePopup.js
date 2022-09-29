import { useEffect } from "react";

function ImagePopup({ isOpen, card, onClose }) {
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
      className={`popup popup_type_image ${isOpen && "popup_opened"}`}
      onClick={handleCloseByOverlayClick}
    >
      <div className="image">
        <img className="image__close-up" src={card.link} alt={card.name} />
        <h2 className="image__title">{card.name}</h2>
        <button
          className="button popup__close-icon"
          type="button"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}

export default ImagePopup;
