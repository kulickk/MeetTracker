import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../utils/links/api.js';
import routing from '../../utils/links/routing.js';
import Header from '../../components/Header/Header.jsx';
import ContentSwitcher from './utils/UserProfilePageSwitcher.jsx';
import Message from '../../components/Message/Message.jsx';
import { fullLogout } from '../../utils/userData/userData.js';

import styles from './UserProfilePage.module.css'


const UserProfilePage = (props) => {
    console.log(props);
    const [users, setUsers] = useState(undefined);
    const [currentContent, setCurrentContent] = useState('account');
    const [messageTitle, setMessageTitle] = useState('');
    const [messageText, setMessageText] = useState('');
    const [messageShown, setMessageShown] = useState(false);
    const [telegramId, setTelegramId] = useState(null); 
    const navigate = useNavigate();

    const messageInfoObj = {
        title: {
            get: messageTitle,
            set: setMessageTitle
        },
        text: {
            get: messageText,
            set: setMessageText
        }
    };

    const messageShownObj = {
        get: messageShown, 
        set: setMessageShown
    }

    const is_Admin = window.localStorage.getItem('is_admin') === 'true';

    const onClickNavigation = (e) => {
        e.preventDefault();
        let name = e.target.name;
        let buttons = document.querySelector(`.${styles.contentNavigation}`).children;
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove(styles.active);
        };
        e.target.classList.add(styles.active);
        if (name === 'users') {
            setCurrentContent('users');
            return;
        }
        if (name === 'config') {
            setCurrentContent('config');
            return;
        }
        if (name === 'account') {
            setCurrentContent('account');
            return;
        }
        if (name === 'archieve') {
            setCurrentContent('archieve');
            return;
        }
    };

    useEffect(() => {
        fetch(api.usersMe, {
          credentials: 'include'
        }).then((response) => {
            if (!response.ok) {
                fullLogout(props.userData, {logout: true});
                navigate(routing.authentidication);
          }
          return response.json();
        }).then((data) => {
            if (data['telegram_id']) {
                setTelegramId(data['telegram_id']);
            }
        });
      });

    if (is_Admin) {
        return (
            <>
            <Header userName={ props.userData.userName.userName }/>
            <div className={ styles.page }>
                <div>
                    <div className={ styles.titleContainer }>
                        <p className={ styles.title }>Панель администратора</p>
                        <Message
                        shown={ messageShownObj }
                        messageInfo={ messageInfoObj }/>
                    </div>
                    <div className={ styles.panel }>
                        <div className={ styles.content }>
                            <div className={ styles.contentNavigation }>
                                <a name="users" href="admin/users" onClick={ onClickNavigation }>Пользователи</a>
                                {/* <a name="config" href="admin/config" onClick={ onClickNavigation }>Конфигурации</a> */}
                                <a className={ styles.active } name="account" href="admin/account" onClick={ onClickNavigation }>Аккаунт</a>
                                <a name="archieve" href="admin/archieve" onClick={ onClickNavigation }>Архив</a>
                            </div>
                            <div className={ styles.panelContent }>
                                <ContentSwitcher 
                                // Контент
                                content={ currentContent } 
                                // Пользовательская инфомация
                                users={ users } 
                                setUsers={ setUsers } 
                                navigate={ navigate } 
                                is_Admin={ is_Admin } 
                                userData={ props.userData }
                                telegram={ {telegramId:telegramId, setTelegramId:setTelegramId} }
                                // Сообщения
                                shown={ messageShownObj }
                                messageInfo={ messageInfoObj }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        );
    }
    return (
        <>
        <Header userName={ props.userData.userName.userName }/>
        <div className={ styles.page }>
            <div>
                <div className={ styles.titleContainer }>
                    <p className={ styles.title }>Панель пользователя</p>
                    <Message
                    shown={ messageShownObj }
                    messageInfo={ messageInfoObj }/>
                </div>
                <div className={ styles.panel }>
                    <div className={ styles.content }>
                        <div className={ styles.contentNavigation }>
                            <a className={ styles.active } name="account" href="admin/account" onClick={ onClickNavigation }>Аккаунт</a>
                            <a name="archieve" href="admin/archieve" onClick={ onClickNavigation }>Архив</a>
                        </div>
                        <div className={ styles.panelContent }>
                            <ContentSwitcher
                            // Контент
                            content={ currentContent }  
                            // Пользовательская инфомация
                            users={ users } 
                            setUsers={ setUsers } 
                            navigate={ navigate } 
                            is_Admin={ is_Admin } 
                            userData={ props.userData }
                            telegram={ {telegramId:telegramId, setTelegramId:setTelegramId} }
                            // Сообщения
                            shown={ messageShownObj }
                            messageInfo={ messageInfoObj }/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default UserProfilePage;