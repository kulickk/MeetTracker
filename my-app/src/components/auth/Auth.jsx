import { React, useState } from "react";
import { Form, Link, useNavigate, Navigate } from "react-router-dom";
import classNames from "classnames";
import styles from './Auth.module.css'
import api from "../../api";
import routing from "../../routing";

const Auth = (props) => {
    const [isSending, setIsSending] = useState(false);
    const navigate = useNavigate();
    const [logIn, setLogIn] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');

    const onChangeLogin = e => {
        setLogIn(e.target.value);
        console.log('Логин', e.target.value);
      };
    
      const onChangePassword = e => {
        setPassword(e.target.value);
        console.log('Пароль', e.target.value);
      };
    
      const onChangeNickname = e => {
        setNickname(e.target.value);
        console.log('Никнейм', e.target.value);
      };

    const handleLogIn = e => {
        e.preventDefault();
        fetch(api.logIn, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            'grant_type': 'password',
            'username': 'user@example.com',
            'password': '123123123',
            'scope': '',
            'client_id': 'string',
            'client_secret': 'string'
          })});
        navigate(routing.index);
      };
    
    const handleRegistration = e => {
        e.preventDefault();
        let [surname, name, patronymic] = nickname.split(' ');
        fetch(api.register, {
            method: 'POST',
            headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, surname: surname, patronymic: patronymic, email: logIn, password: password})
        });
    };

    return (
        <div className={ styles.form }>
            {/* Swicher */}
            <div className={ styles.switcher }>
                <label >
                    <input id="switcher" type="checkbox"
                    onClick={ (e) => {
                        let labelSwitcher = document.getElementById('switcher-label');
                        let registrationForm = document.querySelector(`.${styles.registration}`);
                        let loginForm = document.querySelector(`.${styles.login}`);
                        loginForm.classList.toggle(styles.active);
                        registrationForm.classList.toggle(styles.active);
                        console.log(e.target.checked);
                        if (e.target.checked) {
                            labelSwitcher.textContent = 'Регистрация';
                        }
                        else {
                            labelSwitcher.textContent = 'Вход';
                        }
                    }} />
                    <label id="switcher-label">Вход</label>
                </label>
            </div>
            <div className={ styles.formData }>
                <form className={ styles.registration }>
                    <label htmlFor="registration-login">
                        <p>Имя</p>
                        <input id="registration-login" type="login" placeholder="Введите имя..." onChange={ onChangeNickname } />
                    </label>
                    <label htmlFor="">
                        <p>Пароль</p>
                        <input id="registration-password" type="password" placeholder="Введите пароль..." onChange={ onChangePassword } />
                    </label>
                    <label htmlFor="">
                        <p>Почта</p>
                        <input id="registration-email" type="email" placeholder="Введите почту..." onChange={ onChangeLogin } />
                    </label>
                    <button onClick={ handleRegistration }>Зарегистрироваться</button>
                </form>
                <form className={ classNames(styles.login, styles.active) }>
                    <label htmlFor="login-login">
                        <p>Логин</p>
                        <input id="login-login" type="login" />
                    </label>
                    <label htmlFor="login-password">
                        <p>Пароль</p>
                        <input id="login-password" type="password" />
                    </label>
                    <button onClick={ handleLogIn }>Войти</button>
                </form>
            </div>
        </div>
    );
};

export default Auth;