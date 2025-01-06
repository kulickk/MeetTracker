import { useNavigate } from 'react-router-dom';

import { fullLogout } from '../../../../../utils/userData/userData';
import changeAccountInfo from './utils/UserProfilePageAccountRequests';
import routing from '../../../../../utils/links/routing';
import {validateForm, onChangeValidatedInput} from '../../../../../utils/validation/validateForm.js';
import { nameExp, surnameExp, patronymicExp } from '../../../../../utils/validation/regExp.js';

import styles from './UserProfilePageAccount.module.css';

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
                        regex: /\w+/,
                        message: 'Нужно ввести пароль'
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
                surname: form.querySelector('input[name="surname"]').value,
                name: form.querySelector('input[name="name"]').value,
                patronymic: form.querySelector('input[name="patronymic"]').value,
                oldPassword: form.querySelector('input[name="old-password"]').value,
                newPassword: form.querySelector('input[name="new-password"]').value
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
                <label className={ styles.accountFormLabel } htmlFor="account-password">
                    <input name='new-password' className={ styles.accountFormLabelInput } id="account-new-password" type="password" placeholder="Введите новый пароль..." autoComplete='off' onChange={ onChangeInput }/>
                </label>
            </div>
            <div className={ styles.buttons }>
                <button name='submitter' className={ `admin-panel-button user-button` } onClick={ handleChangeAccountInfo }>
                    <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.28568 9H10.7144V12.375H6.28568V9Z" fill="#282828"/>
                        <path d="M1.93598 13.0822C2.10413 12.6551 2.51125 12.375 2.96399 12.375H14.036C14.4888 12.375 14.8959 12.6551 15.064 13.0822L16.4621 16.6337C16.7204 17.2898 16.2368 18 15.5316 18H1.46836C0.763236 18 0.279578 17.2898 0.53787 16.6337L1.93598 13.0822Z" fill="#282828"/>
                        <path d="M14.036 5.625C14.036 8.7316 11.5575 11.25 8.50006 11.25C5.44264 11.25 2.96411 8.7316 2.96411 5.625C2.96411 2.5184 5.44264 0 8.50006 0C11.5575 0 14.036 2.5184 14.036 5.625Z" fill="#282828"/>
                    </svg>
                    Сохранить изменения
                </button>
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