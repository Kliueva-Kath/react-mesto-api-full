import { useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import ConfirmDeleteCard from "./ConfirmDeleteCard.js";
import ImagePopup from "./ImagePopup.js";
import Login from "./Login.js";
import Register from "./Register.js";
import InfoTooltip from "./InfoTooltip.js";
import ProtectedRoute from "./ProtectedRoute.js";
import api from "../utils/Api.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import auth from "../utils/Auth.js";

function App() {
  const history = useHistory();

  const [currentUser, setCurrentUser] = useState({});

  const [cards, setCards] = useState([]);

  // стейты для проверки открыт ли попап для каждого попапа
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isAddCardPopupOpen, setAddCardPopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setDeleteCardPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = useState(false);
  // рендер текста для кнопкок формы после нажатия на сабмит
  const [isLoading, setIsLoading] = useState(false);

  // проверка авторизации и регистрации
  const [isRegistationSuccessful, setRegistationSuccessful] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  // получаем и устанавливаем информацию о пользователе с сервера
  useEffect(() => {
    if (isLoggedIn) {
      api
        .getUserInfo()
        .then((userInfo) => {
          setCurrentUser(userInfo);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isLoggedIn]);

  // получаем и массив карточек с сервера
  useEffect(() => {
    if (isLoggedIn) {
      api
        .getCards()
        .then((cardsInfo) => {
          setCards(cardsInfo);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isLoggedIn]);

  // проверка токена
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          if (res) {
            setEmail(res.data.email);
            setLoggedIn(true);
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  // событие нажатия на кнопку лайка
  function handleCardLike(card) {
    const isLiked = card.likes.some((item) => item._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    });
  }

  // функция удаления карточки
  function handleCardDelete(card) {
    setIsLoading(true);
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .finally(() => setIsLoading(false));
  }

  // событие нажатия на кнопку удаления карточки
  function handleDeleteCardClick(card) {
    setDeleteCardPopupOpen(!isDeleteCardPopupOpen);
    setSelectedCard(card);
  }

  // событие нажатия на кнопку редактирования профиля
  function handleEditProfileClick() {
    setEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  // событие нажатия на кнопку изменения аватара
  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  // событие нажатия на кнопку добавления новой карточки
  function handleAddCardClick() {
    setAddCardPopupOpen(!isAddCardPopupOpen);
  }

  // событие нажатия на картинку - открывается попап с увеличенным изображением
  function handleCardClick(card) {
    setSelectedCard(card);
    setImagePopupOpen(!isImagePopupOpen);
  }

  // функция закрытия всех попапов
  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setAddCardPopupOpen(false);
    setImagePopupOpen(false);
    setDeleteCardPopupOpen(false);
    setInfoTooltipPopupOpen(false);
    setSelectedCard({});
  }

  // функция изменения информации о пользователе - name, about
  function handleUpdateUser(userInfo) {
    setIsLoading(true);
    api
      .setUserInfo(userInfo)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  // функция изменения аватара
  function handleUpdateAvatar(userInfo) {
    setIsLoading(true);
    api
      .editAvatar(userInfo)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  // функция добавления карточки
  function handleAddCard(newCard) {
    setIsLoading(true);
    api
      .addCard(newCard)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  function handleLogin(data) {
    auth
      .authorize(data)
      .then((res) => {
        if (res.token) {
          localStorage.setItem("jwt", res.token);
          setLoggedIn(true);
          setEmail(res.email);
          history.push("/");
          return res;
        } else {
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleRegistration(data) {
    auth
      .register(data)
      .then((res) => {
        setRegistationSuccessful(true);
        setInfoTooltipPopupOpen(true);
        history.push("/sign-in");
      })
      .catch((err) => {
        setRegistationSuccessful(false);
        setInfoTooltipPopupOpen(true);
      });
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    history.push("/sign-up");
  }

  // JSX-разметка
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email={email} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Switch>
          <Route path="/sign-in">
            <Login onLogin={handleLogin} history={history} />
          </Route>
          <Route path="/sign-up">
            <Register onRegister={handleRegistration} />
          </Route>
          <ProtectedRoute
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddCard={handleAddCardClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            onDeleteCardClick={handleDeleteCardClick}
            isLoggedIn={isLoggedIn}
          />
        </Switch>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        />

        <ConfirmDeleteCard
          isOpen={isDeleteCardPopupOpen}
          onClose={closeAllPopups}
          onCardDelete={handleCardDelete}
          card={selectedCard}
          isLoading={isLoading}
        />

        <AddPlacePopup
          isOpen={isAddCardPopupOpen}
          onClose={closeAllPopups}
          onAddCard={handleAddCard}
          isLoading={isLoading}
        />

        <ImagePopup
          onClose={closeAllPopups}
          card={selectedCard}
          onCardClick={handleCardClick}
          isOpen={isImagePopupOpen}
        />

        <InfoTooltip
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
          isRegistationSuccessful={isRegistationSuccessful}
        />

        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
