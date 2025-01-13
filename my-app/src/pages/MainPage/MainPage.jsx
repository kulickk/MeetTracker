import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/Header/Header';
import styles from './MainPage.module.css'
import api from "../../utils/links/api";

import { getMeets, sendFile } from './utils/MainPageRequests';
import { FileUploadForm, Meetings } from './utils/MainPageUtils';
import Message from '../../components/Message/Message';


const MainPage = (props) => {
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState(undefined);
    const [files, setFiles] = useState(undefined);
    const [messageTitle, setMessageTitle] = useState('');
    const [messageText, setMessageText] = useState('');
    const [messageShown, setMessageShown] = useState(false);

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

    // Получаем все встречи 
    useEffect(() => {
        const intervalId = setInterval(getMeets, 10000, setMeetings, navigate);
        return () => clearInterval(intervalId);
    });

    useEffect(() => {
        if (!meetings) {
            getMeets(setMeetings, navigate);
        }
    });

    const handleRemoveFile = (e) => {
        e.preventDefault();
        setFiles('');
    };
    

    const handleSendFile = async (e) => {
        e.preventDefault();
        const senderButton = e.target;
        if (files) {
            senderButton.disabled = true;
            sendFile(files[0], senderButton, navigate, setMeetings, messageShownObj, messageInfoObj.title, messageInfoObj.text);
        }
    };

    return (
        <>
        <Header userName={ props.userData.userName }/>
        <div className={ styles.page }>
            <div>
                <div className={ styles.titleContainer }>
                    <p className={ styles.title }>Ваши встречи</p>
                    <Message
                    shown={ messageShownObj }
                    messageInfo={ messageInfoObj }/>
                </div>
                <div className={ styles.panel }>
                    <Meetings meetings={ meetings } />
                    <form className={ styles.fileForm }>
                        <input className={ styles.fileFormMeetingName } type="text" placeholder='Введите название...'/>
                        <FileUploadForm 
                        files={ files }
                        setFiles={ setFiles }/>
                        <button onClick={ handleRemoveFile } className={ 'admin-panel-button delete-button' }>
                            <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.5 1C0.5 0.447715 0.947715 0 1.5 0H13.5C14.0523 0 14.5 0.447715 14.5 1C14.5 1.55228 14.0523 2 13.5 2H1.5C0.947716 2 0.5 1.55228 0.5 1Z" fill="white"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M13.5 3H1.5L3.26858 16.2643C3.40106 17.2579 4.24863 18 5.25103 18H9.74897C10.7514 18 11.5989 17.2579 11.7314 16.2643L13.5 3ZM4.95088 13.5579C4.97884 13.8096 5.19157 14 5.44478 14C5.74097 14 5.97139 13.7426 5.93869 13.4482L5.04912 5.44206C5.02116 5.1904 4.80843 5 4.55522 5C4.25903 5 4.02861 5.25745 4.06131 5.55182L4.95088 13.5579ZM9.55522 14C9.80843 14 10.0212 13.8096 10.0491 13.5579L10.9387 5.55182C10.9714 5.25745 10.741 5 10.4448 5C10.1916 5 9.97884 5.1904 9.95088 5.44206L9.06131 13.4482C9.02861 13.7426 9.25903 14 9.55522 14ZM8 13.5C8 13.7761 7.77614 14 7.5 14C7.22386 14 7 13.7761 7 13.5V5.5C7 5.22386 7.22386 5 7.5 5C7.77614 5 8 5.22386 8 5.5V13.5Z" fill="white"/>
                            </svg>
                            Удалить
                            </button>
                        <button onClick={ handleSendFile } className={ 'admin-panel-button send-button' }>
                            <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.6832 4.83318L7.27761 1.32278C6.95005 1.237 6.65908 1.5509 6.7694 1.87103L8.34749 6.44999C8.40604 6.61988 8.56533 6.7344 8.74502 6.73579L14.8804 6.78334C15.2802 6.78644 15.4539 7.29043 15.1409 7.53917L10.3376 11.3566C10.1969 11.4684 10.142 11.6568 10.2005 11.8267L11.7786 16.4056C11.8889 16.7258 12.3115 16.7937 12.5167 16.5244L20.913 5.50017C21.0963 5.2595 20.9758 4.90981 20.6832 4.83318Z" fill="#282828"/>
                                <path d="M8.34285 12.7317L4.08241 16.2279M9.72477 9.02389L3.3325 11.2933M6.51131 7.15277L1 6.72882M20.6832 4.83318L7.27761 1.32278C6.95005 1.237 6.65908 1.5509 6.7694 1.87103L8.34749 6.44999C8.40604 6.61988 8.56533 6.7344 8.74502 6.73579L14.8804 6.78334C15.2802 6.78644 15.4539 7.29043 15.1409 7.53917L10.3376 11.3566C10.1969 11.4684 10.142 11.6568 10.2005 11.8267L11.7786 16.4056C11.8889 16.7258 12.3115 16.7937 12.5167 16.5244L20.913 5.50017C21.0963 5.2595 20.9758 4.90981 20.6832 4.83318Z" stroke="#282828"/>
                            </svg>
                            Отправить
                            </button>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
};

export default MainPage;