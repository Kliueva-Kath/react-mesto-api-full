import React from "react";
import logoPath from "../images/header__logo.svg";
import { Switch, Route, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

function Header({ email, isLoggedIn, onLogout }) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  // настройка рендеринга элементов в зависимости от ширины экрана
  const [isDesktop, setDesktop] = useState(window.innerWidth > 650);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 650);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  function toggleMenu() {
    setMenuOpen(!isMenuOpen);
  }

  function handleLogout() {
    onLogout();
  }

  return (
    <>
      {isLoggedIn && (
        <div
          className={`header__mobile-menu ${
            isMenuOpen && "header__mobile-menu_open"
          }`}
        >
          <p className="header__email">{email}</p>
          <button
            className="button header__logout-button"
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>
      )}
      <header className="header">
        <img className="header__logo" src={logoPath} alt="логотип сайта" />
        <Switch>
          <Route path="/sign-in">
            <NavLink to="/sign-up" className="header__link">
              Регистрация
            </NavLink>
          </Route>
          <Route path="/sign-up">
            <NavLink to="/sign-in" className="header__link">
              Войти
            </NavLink>
          </Route>
          <Route exact path="/">
            {(() => {
              if (isDesktop) {
                return (
                  <div className="header__menu">
                    <p className="header__email">{email}</p>
                    <button
                      className="button header__logout-button"
                      onClick={handleLogout}
                    >
                      Выйти
                    </button>
                  </div>
                );
              } else {
                return (
                  <button
                    className={`button ${
                      isMenuOpen ? "header__menu-exit" : "header__menu-button"
                    }`}
                    onClick={toggleMenu}
                  ></button>
                );
              }
            })()}
          </Route>
        </Switch>
      </header>
    </>
  );
}
export default Header;
