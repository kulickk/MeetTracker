import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import routing from '../../routing';

const Header = () => {
    return (
        <div className={styles.header}>
            <Link to={ routing.mainPage } className={ styles.logo }><img src='../../../assets/images/logo.svg' alt='Логотип'/></Link> 
        </div>
    )
};

export default Header;