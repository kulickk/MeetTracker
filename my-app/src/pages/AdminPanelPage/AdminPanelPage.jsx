import { useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './AdminPanelPage.module.css'
import api from '../../api';

import ValidatorComponent from '../../components/Validator/Validator';

const Account = (props) => {
    return (
        <div>Account</div>
    );
};


const Config = (props) => {
    return (
        <div>Config</div>
    );
};


const Users = (props) => {
    const [usersRows, setUsersRows] = useState();
    const [sortOption, setSortOption] = useState('id');

    const handleInputOnChange = (e) => {
        if (e.target.classList.contains('inputValidationError')) {
            e.target.classList.remove('inputValidationError');
            document.getElementById(e.target.id + '-message').classList.add('hidden');
        }
    };


    const getUsersHtmlRows = (users) => {
       if (users) {
        const tableRows = users.map((element) => {
            const userStatusImg = () => {
            const path = '../../../assets/images/users_statuses/';
            if (element.is_admin) {
                return [path + 'admin.svg', 'Администратор'];
            }
            if (element.is_banned) {
                return [path + 'banned.svg', 'Заблокированный пользователь'];
            }
            return [path + 'user.svg', 'Пользователь'];
            };

            const [path, alt] = userStatusImg();
            return (
                <tr id={ element.id } key={ element.id } onClick={ handleActiveRow } >
                    <td name='id' >{ element.id }</td>
                    <td name='' >{ `${ element.surname } ${element.name } ${ element.patronymic }` }</td>
                    <td name='email' >{ element.email }</td>
                    <td name='status' ><img src={ path } title={ alt } alt='' /></td>
                </tr>
            );
        });
        return tableRows;
       }
    };

    if (props.users && !usersRows) {
        setUsersRows(Array.from(props.users).sort((a, b) => +a.id - +b.id));
    }

    const sortFunctions = {
        id: (a, b) => {
            return +a.id - +b.id;
        },
        surname: (a, b) => {
            return a.surname.localeCompare(b.surname);
        },
        status: (a, b) => {
            const statusA = (a.is_admin) ? 0 : (a.is_banned) ? 2 : 1;
            const statusB = (b.is_admin) ? 0 : (b.is_banned) ? 2 : 1;
            return statusA - statusB;
        }
    };

    const handleSearchUsers = (e) => {
        e.preventDefault();
        let searchInputValue = document.querySelector(`.${styles.usersSearcher} input`).value.trim();
        if (searchInputValue) {
            setUsersRows(
                Array.from(props.users).filter((user) => {
                    return [user.surname, user.name, user.patronymic].join(' ').toLowerCase().includes(searchInputValue.toLowerCase()
            );
            }).sort(sortFunctions['id']).sort(sortFunctions[sortOption]));
        }
        else {
            setUsersRows(
                Array.from(props.users).sort(sortFunctions['id']).sort(sortFunctions[sortOption])
            );
        }
    };
    
    const handleSwitch = (e) => {
        setUsersRows(Array.from(usersRows).sort(sortFunctions['id']).sort(sortFunctions[e.target.value]));        
        setSortOption(e.target.value);
    };

    const handleActiveRow = (e) => {
        let currentRow = e.target.closest('tr');
        if (!currentRow.classList.contains(styles.activeTableRow)) {
            let rows = document.querySelector(`.${styles.usersTableContainer} table tbody`).children;
            Array.from(rows).forEach((row) => {
                row.classList.remove(styles.activeTableRow);
            });
            currentRow.classList.add(styles.activeTableRow);
        }
        else {
            currentRow.classList.toggle(styles.activeTableRow);
        }
    };

    const handleBanUser = (e) => {
        let currentUser = document.querySelector(`.${styles.activeTableRow}`);
        let blockedUser = usersRows.find((user) => user.id == currentUser.id);

        fetch(api.adminBanUser + `?email=${blockedUser.email}`, {
            method: 'POST',
            credentials: 'include'
        }).then((response) => {
            if (response.ok) {
                blockedUser.is_banned = true;
                setUsersRows(usersRows.map((user) => (user.id === blockedUser.id) ? blockedUser : user));
            }
        });
    };

    const handleMakeUserAdmin = (e) => {
        let currentUser = document.querySelector(`.${styles.activeTableRow}`);
        let adminUser = usersRows.find((user) => user.id == currentUser.id);

        fetch(api.adminMakeUserAdmin + `?email=${adminUser.email}`, {
            method: 'POST',
            credentials: 'include'
        }).then((response) => {
            if (response.ok) {
                adminUser.is_admin = true;
                setUsersRows(usersRows.map((user) => (user.id == adminUser.id) ? adminUser : user));
            }
        });
    };

    const handleShowAdminRegistrationForm = (e) => {
        e.preventDefault();
        let form = document.querySelector(`.${ styles.adminRegistrationForm }`);
        form.classList.toggle(styles.hidden);
        form.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAdminRegistration = (e) => {
        const [surname, name, patronymic, email] = Array.from(document.querySelector(`.${styles.adminRegistrationFormLabels}`).children).filter((element) => {
            if (element.tagName === 'LABEL') {
                return element;
            }
        }).map((element) => {
            console.log(element.children[1]);
            if (element.tagName === 'LABEL') {
                return element.children[1].value;
            }
        });
        console.log(surname, name, patronymic, email);
        const body = {
            name: name,
            surname: surname,
            patronymic: patronymic,
            email: email,
            password: '123123123'
        }        
        fetch(api.adminRegisterUser, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        }).then((response) => {
            if (response.ok) {
                fetch(api.adminGetUsers, {
                    credentials: 'include',
                    mode: 'cors',
                }).then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                }).then((data) => {
                    setUsersRows(Array.from(data).sort(sortFunctions['id']).sort(sortFunctions[sortOption]))
                });
            }
        });
    };
    
    return (
        <div className={ styles.usersContent }>
            <div className={ styles.usersTable }>
                <div className={ styles.usersSearcher }>
                    <div>
                        <input type="text" placeholder='Введите имя... ' />
                        <button onClick={ handleSearchUsers }></button>
                    </div>
                    <select onChange={ handleSwitch }>
                        <option value="id">По умолчанию</option>
                        <option value="status">По статусу</option>
                        <option value="surname">По Фамилии</option>
                    </select>
                </div>
                <div className={ styles.usersTableHeader }>
                    <p>ID</p>
                    <p>ФИО</p>
                    <p>Почта</p>
                    <p>Статус</p>
                </div>
                <div className={ styles.usersTableContainer }>
                    <table>
                        <tbody>
                            { getUsersHtmlRows(usersRows) }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={ styles.footerButtonsContainer }>
                <button onClick={ handleBanUser } className={ classNames('admin-panel-button', 'ban-button') }>
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 10.5C0 9.39543 0.895431 8.5 2 8.5H14C15.1046 8.5 16 9.39543 16 10.5V16C16 17.1046 15.1046 18 14 18H2C0.895431 18 0 17.1046 0 16V10.5ZM8.56499 13.39C9.11339 13.1668 9.5 12.6286 9.5 12C9.5 11.1716 8.82843 10.5 8 10.5C7.17157 10.5 6.5 11.1716 6.5 12C6.5 12.6286 6.88661 13.1668 7.43501 13.39L7 16H9L8.56499 13.39Z" fill="white"/>
                        <path d="M8 0C4.68629 0 2 2.68629 2 6V10H5V6C5 4.34315 6.34315 3 8 3C9.65685 3 11 4.34315 11 6V10H14V6C14 2.68629 11.3137 0 8 0Z" fill="white"/>
                    </svg>
                    Заблокировать
                </button>
                <button onClick={ handleMakeUserAdmin } className={ classNames('admin-panel-button', 'set-admin-button') }>
                    <img src='../../../assets/images/button_icons/star.svg' alt='' />
                    Назначить админом
                </button>
                <button onClick={ handleShowAdminRegistrationForm } className={ classNames('admin-panel-button', 'user-button') }>
                    <img src='../../../assets/images/button_icons/plus.svg' alt='' />
                    Добавить пользователя
                </button>
                <button className={ classNames('admin-panel-button', 'user-button') }>
                    <img src='../../../assets/images/button_icons/archieve.svg' alt='' />
                    Архив
                </button>
            </div>
            <div>
                <ValidatorComponent validate={
                    {
                    'registration-surname': {
                        valid: [
                            {
                                regex: /[А-Я][а-я]+/,
                                message: 'Нужно ввести Фамилию'
                            }
                        ]
                    },
                    'registration-name': {
                        valid: [
                            {
                                regex: /[А-Я][а-я]+/,
                                message: 'Нужно ввести Имя'
                            }
                        ]
                    },
                    'registration-patronymic': {
                        valid: [
                            {
                                regex: /[А-Я][а-я]+/,
                                message: 'Нужно ввести Отчество'
                            }
                        ]
                    },
                    'registration-email': {
                        valid: [
                            {
                                regex: /^[A-Za-z]+@[a-z]+\.[a-z]+/, 
                                message: 'Почта не соответствует формату **@*.*'
                            }
                        ]
                    },
                    }
                }>
                    <form className={ classNames(styles.adminRegistrationForm, styles.hidden) } >
                        <div className={ styles.adminRegistrationFormLabels }>
                            <label htmlFor="registration-surname">
                                <p>Фамилия</p>
                                <input id="registration-surname" type="login" placeholder="Введите фамилию..." onChange={ handleInputOnChange }/>
                            </label>
                            <p className={ `ErrorMessage hidden ${styles.message}` } id="registration-surname-message"></p>
                            <label htmlFor="registration-name">
                                <p>Имя</p>
                                <input id="registration-name" type="login" placeholder="Введите имя..." onChange={ handleInputOnChange }/>
                            </label>
                            <p className={ `ErrorMessage hidden ${styles.message}` } id="registration-name-message"></p>
                            <label htmlFor="registration-patronymic">
                                <p>Отчество</p>
                                <input id="registration-patronymic" type="login" placeholder="Введите отчество..." onChange={ handleInputOnChange }/>
                            </label>
                            <p className={ `ErrorMessage hidden ${styles.message}` } id="registration-patronymic-message"></p>
                            <label htmlFor="registration-email">
                                <p>Почта</p>
                                <input id="registration-email" type="email" placeholder="Введите почту..." onChange={ handleInputOnChange }/>
                            </label>
                            <p className={ `ErrorMessage hidden ${styles.message}` } id="registration-email-message"></p>
                        </div>
                        <button onClick={ handleAdminRegistration } className={ classNames('admin-panel-button', 'user-button') }>
                            <img src='../../../assets/images/button_icons/register.svg' alt='' />
                            Зарегистрировать пользователя
                        </button>
                    </form>
                </ValidatorComponent>
            </div>
        </div>
    );
};


const ContentSwitcher = (props) => {
    if (props.content === 'users') {
        return <Users users={ props.users } setUsers={ props.setUsers } />;
    }
    if (props.content === 'config') {
        return <Config />;
    }
    if (props.content === 'account') {
        return <Account />;
    }
};


const AdminPanelPage = (props) => {
    const [users, setUsers] = useState(undefined);
    const [currentContent, setCurrentContent] = useState('users');
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
    };

    useEffect(() => {
        if (!users) {
            fetch(api.adminGetUsers, {
                credentials: 'include',
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
            }).then((data) => {
                if (!users) {
                    setUsers(data);
                }
            })
    }});
    return (
        <div className={ styles.page }>
            <div>
                <p className={ styles.title }>Панель администратора</p>
                <div className={ styles.panel }>
                    <div className={ styles.content }>
                        <div className={ styles.contentNavigation }>
                            <a className={ styles.active } name="users" href="admin/users" onClick={ onClickNavigation }>Пользователи</a>
                            <a name="config" href="admin/config" onClick={ onClickNavigation }>Конфигурации</a>
                            <a name="account" href="admin/account" onClick={ onClickNavigation }>Аккаунт</a>
                        </div>
                        <div className={ styles.panelContent }>
                            <ContentSwitcher content={ currentContent } users={ users } setUsers={ setUsers } />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanelPage;