import { useNavigate } from 'react-router-dom';

import { fullLogout } from '../../../../../utils/userData/userData';
import changeAccountInfo from './utils/UserProfilePageAccountRequests';
import routing from '../../../../../utils/links/routing';
import {validateForm, onChangeValidatedInput} from '../../../../../utils/validation/validateForm.js';
import { nameExp, surnameExp, patronymicExp, passwordExp } from '../../../../../utils/validation/regExp.js';
import api from '../../../../../utils/links/api.js';

import styles from './UserProfilePageAccount.module.css';

const showTelegramIcon = (telegram) => {
    const handleLinkTg = async () => {
        try {
            const response = await fetch(api.usersGetTgLink, {
                credentials: 'include'
            });
            if (response.ok) {
                fetch(api.usersMe, {
                    credentials: 'include'
                }).then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                }).then((data) => {
                    if (data['telegram_id']) {
                        telegram.setTelegramId(data['telegram_id']);
                    }
                });
                const data = await response.json();
                const link = document.createElement('a');
                link.style.display = 'none';
                link.href = data.telegram_link;
                link.click();
                link.remove();
            }
        } catch {

        }
    };

    if (telegram.telegramId) {
        return (
            <button onClick={ (e) => e.preventDefault() } className={ `admin-panel-button telegram-button_ready ${styles.telegramButton}` }>
                Привязан
            </button>
        );
    } else {
        return (
            <button onClick={ handleLinkTg } className={ `admin-panel-button telegram-button_not-ready ${styles.telegramButton}` }>
                Привязать
            </button>
        );
    }
};

const Account = (props) => {
    const navigate = useNavigate();

    const handleChangeAccountInfo = (e) => {
        e.preventDefault();
        const form = e.target.closest('form');
        const validate= {
            'account-surname': {
                valid: [
                    {
                        regex: surnameExp,
                        message: 'Введите корректную фамилию'
                    }
                ],
                params: {
                    requered: false
                }
            },
            'account-name': {
                valid: [
                    {
                        regex: nameExp,
                        message: 'Введите корректное имя'
                    }
                ],
                params: {
                    requered: false
                }
            },
            'account-patronymic': {
                valid: [
                    {
                        regex: patronymicExp,
                        message: 'Введите корректное отчество'
                    }
                ],
                params: {
                    requered: false
                }
            },
            'account-old-password': {
                valid: [
                    {
                        regex: passwordExp,
                        message: 'Нужно ввести текущий пароль'
                    }
                ],
                params: {
                    requered: false,
                    requeredFor: 'account-new-password'
                }
            },
            'account-new-password': {
                valid: [
                    {
                        regex: passwordExp,
                        message: 'Длина нового пароле не менее 8'

                    }
                ],
                params: {
                    requered: false,
                    requeredIn: 'account-old-password'
                }
            }
        };
        const validateResult = validateForm(form, validate);
        if (validateResult) {
            const data = {
                surname: form.querySelector('input[name="surname"]').value,
                name: form.querySelector('input[name="name"]').value,
                patronymic: form.querySelector('input[name="patronymic"]').value,
                old_password: form.querySelector('input[name="old-password"]').value,
                new_password: form.querySelector('input[name="new-password"]').value

            };
            Object.keys(data).forEach((key) => {
                if (!data[key]) {
                    delete data[key];
                }
            });
            changeAccountInfo(data, props.userData.userName.setUsername, props.shown, props.messageInfo.title, props.messageInfo.text);
        }
    };

    const onChangeInput = (e) => {
        onChangeValidatedInput(e.target);
    };

    const handleLogOut = () => {
        fullLogout(props.userData, { logout: true });
        navigate(routing.authentidication);
    };

    return (
        <form className={ `${styles.accountForm}` } >
            <div className={ styles.accountFormLabels }>
                <label className={ styles.accountFormLabel } htmlFor="account-surname">
                    <p className={ styles.accountFormLabelTitle }>Фамилия</p>
                    <input name='surname' className={ styles.accountFormLabelInput } id="account-surname" type="login" placeholder="Введите фамилию..." autoComplete='off' onChange={ onChangeInput }/>
                </label>
                <p className={ `ErrorMessage hidden ${styles.errorMessage}` } id="account-surname-message"></p>
                <label className={ styles.accountFormLabel } htmlFor="account-name">
                    <p className={ styles.accountFormLabelTitle }>Имя</p>
                    <input name='name' className={ styles.accountFormLabelInput } id="account-name" type="login" placeholder="Введите имя..." autoComplete='off' onChange={ onChangeInput }/>
                </label>
                <p className={ `ErrorMessage hidden ${styles.errorMessage}` } id="account-name-message"></p>
                <label className={ styles.accountFormLabel } htmlFor="account-patronymic">
                    <p className={ styles.accountFormLabelTitle }>Отчество</p>
                    <input name='patronymic' className={ styles.accountFormLabelInput } id="account-patronymic" type="login" placeholder="Введите отчество..." autoComplete='off' onChange={ onChangeInput }/>
                </label>
                <p className={ `ErrorMessage hidden ${styles.errorMessage}` } id="account-patronymic-message"></p>
                <label className={ styles.accountFormLabel } htmlFor="account-old-password">
                    <p className={ styles.accountFormLabelTitle }>Пароль</p>
                    <input name='old-password' className={ styles.accountFormLabelInput } id="account-old-password" type="password" placeholder="Введите старый пароль..." autoComplete='off' onChange={ onChangeInput }/>
                </label>
                <p className={ `ErrorMessage hidden ${styles.errorMessage}` } id="account-old-password-message"></p>
                <label className={ styles.accountFormLabel } htmlFor="account-password">
                    <input name='new-password' className={ styles.accountFormLabelInput } id="account-new-password" type="password" placeholder="Введите новый пароль..." autoComplete='off' onChange={ onChangeInput }/>
                </label>
                <p className={ `ErrorMessage hidden ${styles.errorMessage}` } id="account-new-password-message"></p>
            </div>
            <div className={ styles.buttons }>
                <button name='submitter' className={ `admin-panel-button user-button` } onClick={ handleChangeAccountInfo }>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16ZM9 13C11.2091 13 13 11.2091 13 9C13 6.79086 11.2091 5 9 5C6.79086 5 5 6.79086 5 9C5 11.2091 6.79086 13 9 13Z" fill="#282828"/>
                        <path d="M7 1C7 0.447715 7.44772 0 8 0H10C10.5523 0 11 0.447715 11 1V3H7V1Z" fill="#282828"/>
                        <path d="M15 11V7H17C17.5523 7 18 7.44772 18 8V10C18 10.5523 17.5523 11 17 11H15Z" fill="#282828"/>
                        <path d="M1 11C0.447715 11 0 10.5523 0 10V8C0 7.44772 0.447715 7 1 7H3V11H1Z" fill="#282828"/>
                        <path d="M7 15H11V17C11 17.5523 10.5523 18 10 18H8C7.44772 18 7 17.5523 7 17V15Z" fill="#282828"/>
                        <path d="M12 14.8284L14.8284 12L16.2426 13.4142C16.6332 13.8047 16.6332 14.4379 16.2426 14.8284L14.8284 16.2426C14.4379 16.6332 13.8047 16.6332 13.4142 16.2426L12 14.8284Z" fill="#282828"/>
                        <path d="M1.70711 4.53553C1.31658 4.14501 1.31658 3.51184 1.70711 3.12132L3.12132 1.70711C3.51184 1.31658 4.14501 1.31658 4.53553 1.70711L5.94975 3.12132L3.12132 5.94975L1.70711 4.53553Z" fill="#282828"/>
                        <path d="M13.4142 1.70711C13.8047 1.31658 14.4379 1.31658 14.8284 1.70711L16.2426 3.12132C16.6332 3.51184 16.6332 4.14501 16.2426 4.53553L14.8284 5.94975L12 3.12132L13.4142 1.70711Z" fill="#282828"/>
                        <path d="M3.12132 12L5.94975 14.8284L4.53553 16.2426C4.14501 16.6332 3.51184 16.6332 3.12132 16.2426L1.70711 14.8284C1.31658 14.4379 1.31658 13.8047 1.70711 13.4142L3.12132 12Z" fill="#282828"/>
                    </svg>
                    Сохранить изменения
                </button>
                { showTelegramIcon(props.telegram) }
                <button className={ `admin-panel-button logout-button` } onClick={ handleLogOut }>
                    <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.39699e-05 1.10976L7.86845 3.087C8.9487 3.35845 9.70653 4.33406 9.70653 5.4533V15.0597C9.70653 16.6465 8.22292 17.8108 6.69137 17.426L4.39699e-05 15.7445V1.10976Z" fill="white"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M10.3131 0.500048L0 0.5L4.39699e-05 15.7445L10.3131 15.7445C11.6533 15.7445 13.3464 14.155 13.3464 12.6956L13.3464 10.2565H12.1331L12.1331 12.0859C12.1331 13.433 11.0467 14.525 9.70649 14.525H3.63993C2.29975 14.525 1.21331 13.433 1.21331 12.0859V4.26035C1.21331 2.91326 2.29974 1.82122 3.63993 1.82122L9.70648 1.82121C11.0467 1.8212 12.1331 2.91324 12.1331 4.26033L12.1331 6.59782H13.3464V3.54891C13.3464 1.86507 11.9883 0.500048 10.3131 0.500048Z" fill="white"/>
                        <path d="M14.2485 10.6022C14.0116 10.364 14.0116 9.97793 14.2485 9.7398L15.9644 8.01507C16.2013 7.77694 16.5854 7.77694 16.8223 8.01507C17.0592 8.25321 17.0592 8.6393 16.8223 8.87744L15.1064 10.6022C14.8695 10.8403 14.4854 10.8403 14.2485 10.6022Z" fill="white"/>
                        <path d="M14.2485 7.15271C14.0116 6.91458 14.0116 6.52849 14.2485 6.29035C14.4854 6.05222 14.8695 6.05222 15.1064 6.29035L16.8223 8.01507C17.0592 8.25321 17.0592 8.6393 16.8223 8.87744C16.5854 9.11557 16.2013 9.11557 15.9644 8.87744L14.2485 7.15271Z" fill="white"/>
                        <path d="M11.5262 9.0525C11.5262 9.0525 11.5262 9.0525 11.5262 9.0525C11.5254 9.0525 10.9195 9.05206 10.9195 8.44268C10.9195 7.83329 11.5254 7.83293 11.5262 7.83293C11.5262 7.83293 11.5262 7.83293 11.5262 7.83293H15.5678C15.8047 7.83293 15.9968 8.20454 15.9968 8.44267C15.9968 8.68081 15.8047 9.0525 15.5678 9.0525H11.5262Z" fill="white"/>
                    </svg>
                    Выйти
                </button>
            </div>
        </form>
    );
};

export default Account;