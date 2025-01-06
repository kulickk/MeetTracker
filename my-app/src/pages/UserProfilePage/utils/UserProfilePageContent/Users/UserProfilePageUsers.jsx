import { useState, useEffect } from "react";

import api from "../../../../../utils/links/api.js";
import { getUsers } from "../../UserProfilePageRequests.jsx";
import { fullLogout } from "../../../../../utils/userData/userData.js";
import { showMessage } from "../../../../../utils/message.js";
import {validateForm, onChangeValidatedInput} from '../../../../../utils/validation/validateForm.js';
import { nameExp, surnameExp, patronymicExp, emailExp } from "../../../../../utils/validation/regExp.js";

import styles from '../../../UserProfilePage.module.css'


const Users = (props) => {
    const [usersRows, setUsersRows] = useState();
    const [sortOption, setSortOption] = useState('id');

    const is_Admin = window.localStorage.getItem('is_admin') === 'true';

    const handleInputOnChange = (e) => {
        onChangeValidatedInput(e.target);
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

    const handleBanUser = async (e) => {
        let currentUser = document.querySelector(`.${styles.activeTableRow}`);
        let blockedUser = usersRows.find((user) => user.id == currentUser.id);

        try {
            const responseBan = await fetch(api.adminBanUser + `?email=${blockedUser.email}`, {
                method: 'POST',
                credentials: 'include'
            })

            if (!responseBan.ok) {
                const responseErrorMessage = await responseBan.json();
                throw new Error(responseErrorMessage.detail);
            }
            
            blockedUser.is_banned = true;
            setUsersRows(usersRows.map((user) => (user.id === blockedUser.id) ? blockedUser : user));
            showMessage(props.shown, props.messageInfo.title, props.messageInfo.text, '', 'Пользователь Заблокирован!');
        } catch (err) {
            // Выводим сообщение об ошибке
            showMessage(props.shown, props.messageInfo.title, props.messageInfo.text, 'Ошибка', err.message);
        }
    };

    const handleMakeUserAdmin = async (e) => {
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
        try {
            const responseMakeAdmin = await fetch(api.adminMakeUserAdmin + `?email=${adminUser.email}`, {
                method: 'POST',
                credentials: 'include'
            })

            if (!responseMakeAdmin.ok) {
                const responseErrorMessage = await responseMakeAdmin.json();
                throw new Error(responseErrorMessage.detail);
            }
            
            adminUser.is_admin = true;
            setUsersRows(usersRows.map((user) => (user.id == adminUser.id) ? adminUser : user));
            showMessage(props.shown, props.messageInfo.title, props.messageInfo.text, '', 'Админ добавлен!');
        } catch (err) {
            // Выводим сообщение об ошибке
            showMessage(props.shown, props.messageInfo.title, props.messageInfo.text, 'Ошибка', err.message);
        }
    };

    const handleShowAdminRegistrationForm = (e) => {
        e.preventDefault();
        const form = document.querySelector(`.${styles.adminRegistrationForm}`);
        form.classList.toggle(styles.hidden);
        form.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    };

    const handleAdminRegistration = async (e) => {
        e.preventDefault();
        const form = e.target.closest('form');
        const validate= {
            'registration-surname': {
                valid: [
                    {
                        regex: surnameExp,
                        message: 'Нужно ввести фамилию'
                    }
                ],
                params: {
                    requered: true
                }
            },
            'registration-name': {
                valid: [
                    {
                        regex: nameExp,
                        message: 'Нужно ввести имя'
                    }
                ],
                params: {
                    requered: true
                }
            },
            'registration-patronymic': {
                valid: [
                    {
                        regex: patronymicExp,
                        message: 'Нужно ввести отчество'
                    }
                ],
                params: {
                    requered: true
                }
            },
            'registration-email': {
                valid: [
                    {
                        regex: emailExp, 
                        message: 'Почта не соответствует формату **@*.*'
                    }
                ],
                params: {
                    requered: true
                }
            }
        };
        const validateResult = validateForm(form, validate);
        if (validateResult) {
            const data = {
                name: form.querySelector('#registration-name').value,
                surname: form.querySelector('#registration-surname').value,
                patronymic: form.querySelector('#registration-patronymic').value,
                email: form.querySelector('#registration-email').value
            }
            try {
                const responseReg = await fetch(api.adminRegisterUser, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'application/json'
                    }
                })

                if (!responseReg.ok) {
                    const responseErrorMessage = await responseReg.json();
                    throw new Error(responseErrorMessage.detail);
                }
                
                const responseGetUsers = await fetch(api.adminGetUsers, {
                    credentials: 'include',
                    mode: 'cors',
                });
    
                if (responseGetUsers.ok) {
                    const data = await responseGetUsers.json();
                    setUsersRows(Array.from(data).sort(sortFunctions['id']).sort(sortFunctions[sortOption]));
                    showMessage(props.shown, props.messageInfo.title, props.messageInfo.text, '', 'Пользователь зарегистрирован!');
                };
            } catch (err) {
                // Выводим сообщение об ошибке
                showMessage(props.shown, props.messageInfo.title, props.messageInfo.text, 'Ошибка', err.message);
            }
        }
    };

    useEffect(() => {
        if (is_Admin) {
            getUsers(props.userData, props.users, props.setUsers, props.navigate).then((result) => {
                if (result) {
                    fullLogout(props.userData, { logout: true });
                }
            });
        }
    });
    
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
                <button onClick={ handleBanUser } className={ `admin-panel-button ban-button` }>
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 10.5C0 9.39543 0.895431 8.5 2 8.5H14C15.1046 8.5 16 9.39543 16 10.5V16C16 17.1046 15.1046 18 14 18H2C0.895431 18 0 17.1046 0 16V10.5ZM8.56499 13.39C9.11339 13.1668 9.5 12.6286 9.5 12C9.5 11.1716 8.82843 10.5 8 10.5C7.17157 10.5 6.5 11.1716 6.5 12C6.5 12.6286 6.88661 13.1668 7.43501 13.39L7 16H9L8.56499 13.39Z" fill="white"/>
                        <path d="M8 0C4.68629 0 2 2.68629 2 6V10H5V6C5 4.34315 6.34315 3 8 3C9.65685 3 11 4.34315 11 6V10H14V6C14 2.68629 11.3137 0 8 0Z" fill="white"/>
                    </svg>
                    Заблокировать
                </button>
                <button onClick={ handleMakeUserAdmin } className={ `admin-panel-button set-admin-button` }>
                    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.536 0.688846C7.83943 -0.229617 9.16058 -0.229614 9.464 0.688848L10.7757 4.65931C10.9114 5.07006 11.3006 5.34816 11.7397 5.34816H15.9844C16.9664 5.34816 17.3746 6.58394 16.5802 7.15158L13.1462 9.60547C12.7909 9.85932 12.6423 10.3093 12.7779 10.72L14.0896 14.6905C14.3931 15.609 13.3242 16.3727 12.5299 15.8051L9.09579 13.3512C8.74053 13.0973 8.25947 13.0973 7.90422 13.3512L4.47014 15.8051C3.67576 16.3727 2.60693 15.609 2.91036 14.6905L4.22206 10.72C4.35775 10.3093 4.2091 9.85932 3.85384 9.60547L0.419768 7.15158C-0.374613 6.58394 0.0336467 5.34816 1.01556 5.34816H5.2603C5.69942 5.34816 6.0886 5.07006 6.2243 4.65931L7.536 0.688846Z" fill="white"/>
                    </svg>
                    Назначить админом
                </button>
                <button onClick={ handleShowAdminRegistrationForm } className={ `admin-panel-button user-button` }>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 2C6 0.895431 6.89543 0 8 0C9.10457 0 10 0.895431 10 2V14C10 15.1046 9.10457 16 8 16C6.89543 16 6 15.1046 6 14V2Z" fill="#282828"/>
                        <path d="M2 10C0.895431 10 0 9.10457 0 8C0 6.89543 0.895431 6 2 6H14C15.1046 6 16 6.89543 16 8C16 9.10457 15.1046 10 14 10H2Z" fill="#282828"/>
                    </svg>
                    Добавить пользователя
                </button>
                <button className={ `admin-panel-button user-button` }>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 2C0 0.895431 0.895431 0 2 0C3.10457 0 4 0.895431 4 2V14C4 15.1046 3.10457 16 2 16C0.895431 16 0 15.1046 0 14V2Z" fill="#282828"/>
                        <path d="M6 2C6 0.895431 6.89543 0 8 0C9.10457 0 10 0.895431 10 2V14C10 15.1046 9.10457 16 8 16C6.89543 16 6 15.1046 6 14V2Z" fill="#282828"/>
                        <path d="M12 2C12 0.895431 12.8954 0 14 0C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16C12.8954 16 12 15.1046 12 14V2Z" fill="#282828"/>
                    </svg>
                    Архив
                </button>
            </div>
            <div>
                <form className={ `${styles.adminRegistrationForm} ${styles.hidden}` } >
                    <div className={ styles.adminRegistrationFormLabels }>
                        <label className={ styles.registrationFormLabel } htmlFor="registration-surname">
                            <p className={ styles.registrationFormLabelTitle }>Фамилия</p>
                            <input className={ styles.registrationFormLabelInput } id="registration-surname" type="login" placeholder="Введите фамилию..." onChange={ handleInputOnChange }/>
                        </label>
                        <p className={ `ErrorMessage hidden ${styles.message}` } id="registration-surname-message"></p>
                        <label className={ styles.registrationFormLabel } htmlFor="registration-name">
                            <p className={ styles.registrationFormLabelTitle }>Имя</p>
                            <input className={ styles.registrationFormLabelInput } id="registration-name" type="login" placeholder="Введите имя..." onChange={ handleInputOnChange }/>
                        </label>
                        <p className={ `ErrorMessage hidden ${styles.message}` } id="registration-name-message"></p>
                        <label className={ styles.registrationFormLabel } htmlFor="registration-patronymic">
                            <p className={ styles.registrationFormLabelTitle }>Отчество</p>
                            <input className={ styles.registrationFormLabelInput } id="registration-patronymic" type="login" placeholder="Введите отчество..." onChange={ handleInputOnChange }/>
                        </label>
                        <p className={ `ErrorMessage hidden ${styles.message}` } id="registration-patronymic-message"></p>
                        <label className={ styles.registrationFormLabel } htmlFor="registration-email">
                            <p className={ styles.registrationFormLabelTitle }>Почта</p>
                            <input className={ styles.registrationFormLabelInput } id="registration-email" type="email" placeholder="Введите почту..." onChange={ handleInputOnChange }/>
                        </label>
                        <p className={ `ErrorMessage hidden ${styles.message}` } id="registration-email-message"></p>
                    </div>
                    <button name='submitter' onClick={ handleAdminRegistration } className={ `admin-panel-button user-button` }>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.78568 9.00002H11.2144V12.3216H6.78568V9.00002Z" fill="#F59D0E"/>
                            <path d="M2.43598 13.0176C2.60413 12.5972 3.01125 12.3216 3.46399 12.3216H14.536C14.9888 12.3216 15.3959 12.5972 15.564 13.0176L16.9514 16.4861C17.2142 17.143 16.7304 17.8575 16.023 17.8575H1.97703C1.26957 17.8575 0.785811 17.143 1.04856 16.4861L2.43598 13.0176Z" fill="#282828"/>
                            <path d="M14.536 5.67846C14.536 8.73587 12.0575 11.2144 9.00006 11.2144C5.94264 11.2144 3.46411 8.73587 3.46411 5.67846C3.46411 2.62104 5.94264 0.142517 9.00006 0.142517C12.0575 0.142517 14.536 2.62104 14.536 5.67846Z" fill="#282828"/>
                        </svg>
                        Зарегистрировать пользователя
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Users;