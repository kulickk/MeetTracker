import { Link } from 'react-router-dom';

import routing from '../../utils/links/routing';

import styles from './Header.module.css';


const Header = (props) => {
    const userData = props.userData;
    let userName = '';
    if (userData) {
        if (userData.userName.userName) {
            userName = props.userData.userName.userName;
        }
    } 
    if (window.localStorage.getItem('login')) {
        userName = window.localStorage.getItem('login');
    }
    if (userName) {
        return (
            <div className={styles.header} id='header'>
                <Link to={ routing.mainPage } className={ styles.logo }><img src='../../../assets/images/logo.svg' alt='Логотип'/></Link>
                <Link to={ routing.profile } className={ styles.profile }>{ userName }</Link>
            </div>
        )
    }
    return (
        <div className={styles.header} id='header'>
            <div className={ styles.logo }>
                <img src='../../../assets/images/logo.svg' alt='Логотип'/>
            </div>
            <Link to={ routing.profile } className={ styles.profile }>{ userName }</Link>
        </div>
    )
};

export default Header;