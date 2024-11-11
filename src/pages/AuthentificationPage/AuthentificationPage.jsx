import { React } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '../../components/auth/Auth';
import styles from './AuthentificationPage.module.css'
import api from '../../api';
import routing from '../../routing';

const AuthPage = (props) => {
    return (
        <div className={ styles.content }>
            <Auth 
            handleLogIn={ props.handleLogIn } 
            handleRegistration={ props.handleRegistration } 
            user={ props.user } 
            loginForm={ props.loginForm } />
        </div>
    );
};

export default AuthPage;