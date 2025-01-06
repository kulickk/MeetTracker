import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../utils/links/api";
import routing from "../../utils/links/routing";
import {validateForm, onChangeValidatedInput} from "../../utils/validation/validateForm.js";
import { emailExp } from "../../utils/validation/regExp.js";

import styles from './Auth.module.css'


const Auth = (props) => {
    const [isSending, setIsSending] = useState(false);
    const navigate = useNavigate();
    const [logIn, setLogIn] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const onChangeLogin = (e) => {
        setLogIn(e.target.value);
        onChangeValidatedInput(e.target);
      };
    
      const onChangePassword = (e) => {
        setPassword(e.target.value);
      };
    
      const onChangeNickname = (e) => {
        setNickname(e.target.value);
      };

    const handleLogIn = (e) => {
        e.preventDefault();
        const form = e.target.closest('form');
        const validate= {
            'login-login': {
                valid: [
                    {
                        regex: emailExp, 
                        message: 'Почта не соответствует формату **@*.*'
                    }
                ]
            },
            'login-password': {
                valid: [
                    {
                        regex: /\w{2,}/,
                        message: 'Нужно ввести пароль'
                    }
                ]
            }
        };
        const validateResult = validateForm(form, validate);
        console.log(validateResult);
        if (validateResult) {
            fetch(api.logIn, {
                method: 'POST',
                credentials: 'include',
                mode: 'cors',
                headers: {
                  'accept': 'application/json',
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                  'grant_type': 'password',
                  'username': logIn,
                  'password': password,
                  'scope': '',
                  'client_id': 'string',
                  'client_secret': 'string'
                })}).then((response) => {
                  if (response.ok) {
                      fetch(api.usersMe, {
                          credentials: 'include'
                      }).then((response) => {
                          if (response.ok) {
                              return response.json()
                          }
                      }).then((data) => {
                          const username = [data.surname, data.name, data.patronymic].join(' ');
                          window.localStorage.setItem('login', username);
                          window.localStorage.setItem('is_admin', data.is_admin);
                          props.userData.userName.setUsername(username);
                          props.userData.admin.setIsAdmin(data.is_admin);
                      })
                      navigate(routing.mainPage);
                  }
                });
        }
      };
    
    const handleRegistration = (e) => {
        e.preventDefault();
        let [surname, name, patronymic] = nickname.split(' ');
        fetch(api.register, {
            method: 'POST',
            headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, surname: surname, patronymic: patronymic, email: logIn, password: password})
        })
    };

    // const handleSwitchForm = (e) => {
    //     let labelSwitcher = document.getElementById('switcher-label');
    //     let registrationForm = document.querySelector(`.${styles.registration}`);
    //     let loginForm = document.querySelector(`.${styles.login}`);
    //     loginForm.classList.toggle(styles.active);
    //     registrationForm.classList.toggle(styles.active);
    //     console.log(e.target.checked);
    //     if (e.target.checked) {
    //         labelSwitcher.textContent = 'Регистрация';
    //     }
    //     else {
    //         labelSwitcher.textContent = 'Вход';
    //     }
    // };

    return (
        <div className={ styles.form }>
            {/* Swicher */}
            <div className={ styles.switcher }>
                {/* <input id="switcher" type="checkbox"
                onClick={handleSwitchForm} /> */}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 18V13.83L7.11905 6.88009L11.3905 11.0501L9.25476 13.135H7.83096V14.525L7.11905 15.22L4.98334 14.525L5.69524 16.61L4.27143 18H0Z" fill="white"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.9593 11.7944C15.2955 11.7944 18 9.15417 18 5.89722C18 2.64028 15.2955 0 11.9593 0C8.62309 0 5.91857 2.64028 5.91857 5.89722C5.91857 9.15417 8.62309 11.7944 11.9593 11.7944ZM11.9593 8.84583C13.6274 8.84583 14.9796 7.5257 14.9796 5.89722C14.9796 4.26875 13.6274 2.94861 11.9593 2.94861C10.2912 2.94861 8.93893 4.26875 8.93893 5.89722C8.93893 7.5257 10.2912 8.84583 11.9593 8.84583Z" fill="white"/>
                </svg>
                <label id="switcher-label">Вход</label>
            </div>
            <div className={ styles.formData }>
                <form className={ styles.registration }>
                    <label htmlFor="registration-login">
                        <p>Имя</p>
                        <input id="registration-login" type="login" placeholder="Введите имя..." onChange={ onChangeNickname } />
                    </label>
                    <p id="registration-login-message"></p>
                    <label htmlFor="">
                        <p>Пароль</p>
                        <input id="registration-password" type="password" placeholder="Введите пароль..." onChange={ onChangePassword } />
                    </label>
                    <p id="registration-password-message"></p>
                    <label htmlFor="">
                        <p>Почта</p>
                        <input id="registration-email" type="email" placeholder="Введите почту..." onChange={ onChangeLogin } />
                    </label>
                    <p id="registration-email-message"></p>
                    <button onClick={ handleRegistration }>Зарегистрироваться</button>
                </form>
                <form className={ `${styles.login} ${styles.active}` }>
                    <label htmlFor="login-login">
                        <p>Email</p>
                        <input id="login-login" type="login" onChange={ onChangeLogin } />
                    </label>
                    <p className={ 'ErrorMessage hidden' } id="login-login-message"></p>
                    <label htmlFor="login-password">
                        <p>Пароль</p>
                        <input id="login-password" type="password" onChange={ onChangePassword } />
                    </label>
                    <p className={ 'ErrorMessage hidden' } id="login-password-message"></p>
                    <button name='submitter' onClick={ handleLogIn } className={ 'user-button' }>Войти</button>
                </form>
            </div>
        </div>
    );
};

export default Auth;