import { React } from 'react';

import Header from '../../components/Header/Header.jsx';
import Auth from '../../components/auth/Auth';

import styles from './AuthentificationPage.module.css'

const AuthPage = (props) => {
    return (
        <>
        <Header userData={ props.userData }/>
        <div className={ styles.content }>
            <Auth 
            handleLogIn={ props.handleLogIn } 
            handleRegistration={ props.handleRegistration } 
            user={ props.user } 
            loginForm={ props.loginForm } 
            userName={ props.userName }
            userData={ props.userData }
            />
        </div>
        </>
    );
};

export default AuthPage;