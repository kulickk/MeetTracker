import { React } from 'react';
import Auth from '../../components/auth/Auth';
import styles from './AuthentificationPage.module.css'

const AuthPage = (props) => {
    return (
        <div className={ styles.content }>
            <Auth handleLogIn={ props.handleLogIn } handleRegistration={ props.handleRegistration } user={ props.user } loginForm={ props.loginForm } />
        </div>
    );
};

export default AuthPage;