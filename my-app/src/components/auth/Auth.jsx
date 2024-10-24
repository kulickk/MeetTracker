import { React, useState } from "react";
import { Form, Link } from "react-router-dom";
import classNames from "classnames";
import styles from './Auth.module.css'
import api from "../../api";
import routing from "../../routing";

const AuthForm = (props) => {
    // console.log('Пропсы AuthForm', props.loginForm.login);
    if (props.isChecked) {
        return (
            // Login
            <div id='loginAuth' className={ styles.login }>
                <label htmlFor="">
                    <p>Логин</p>
                    <input id="login-input-login" onChange={props.loginForm.login.onChangeLogin} type="login" placeholder="Введите логин..." />
                </label>
                <label htmlFor="">
                    <p>Пароль</p>
                    <input id="login-input-password" onChange={props.loginForm.pass.onChangePassword} type="password" placeholder="Введите пароль..." />
                </label>
                <button onClick={ props.handleLogIn }><Link to={ routing.index }>Войти</Link></button>
            </div>
        );
    }
    else {
        return (
            // Registration
            <div className={ classNames(styles.registration, styles.active ) }>
                <label htmlFor="">
                    <p>Имя</p>
                    <input  type="login" onChange={props.loginForm.nickname.onChangeNickname} placeholder="Введите имя..." />
                </label>
                <label htmlFor="">
                    <p>Почта</p>
                    <input type="email" onChange={props.loginForm.login.onChangeLogin} placeholder="Введите почту..." />
                </label>
                <label htmlFor="">
                    <p>Пароль</p>
                    <input type="password" onChange={props.loginForm.pass.onChangePassword} placeholder="Введите пароль..." />
                </label>
                <button onClick={ props.handleRegistration } >Зарегистрироваться</button>
            </div>
        );
    }
};

const isRegister = (isReg) => (!isReg) ? 'Регистрация' : 'Вход'

const Auth = (props) => {
    const [checkbox, setCheckBox] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // const handleRegistration = () => {
    //     setIsSending(true);
    //     const data = {
    //         username: "LOX",
    //         email: "user@example.com",
    //         password: "password123"
    //     };
    //     const response = fetch(api.register, {
    //         method: 'POST',
    //         mode: 'no-cors',
    //         body: JSON.stringify(data),
    //         headers: {
    //             'Content-Type': 'application-json',
    //             'Accept': 'application/json'
    //         }
    //     })
    //     setIsSending(false);
    // };

    return (
        <div className={ styles.form }>
            {/* Swicher */}
            <div className={ styles.switcher }>
                <label htmlFor="">
                    <input type="checkbox" onClick={ () => {
                        setCheckBox(!checkbox);
                    } } value={false} />
                    <label htmlFor="">{ isRegister(checkbox) }</label>
                </label>
            </div>
            <div className={ styles.formData }>
                <AuthForm isChecked={ checkbox } handleLogIn={ props.handleLogIn } handleRegistration={ props.handleRegistration } user={ props.user } loginForm={ props.loginForm } />
                {/* <div className={ classNames(styles.registration, styles.active ) }>
                    <label htmlFor="">
                        <p>Имя</p>
                        <input type="login" placeholder="Введите имя..." />
                    </label>
                    <label htmlFor="">
                        <p>Пароль</p>
                        <input type="password" placeholder="Введите пароль..." />
                    </label>
                    <label htmlFor="">
                        <p>Почта</p>
                        <input type="email" placeholder="Введите почту..." />
                    </label>
                    <button>Зарегистрироваться</button>
                </div>
                <div className={ styles.login }>
                    <label htmlFor="">
                        <p>Логин</p>
                        <input type="login" />
                    </label>
                    <label htmlFor="">
                        <p>Пароль</p>
                        <input type="password" />
                    </label>
                    <button>Войти</button>
                </div> */}
            </div>
        </div>
    );
};

export default Auth;