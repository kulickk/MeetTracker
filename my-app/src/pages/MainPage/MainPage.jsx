import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


import styles from './MainPage.module.css'
import api from "../../api";
import routing from '../../routing';
import classNames from 'classnames';

const Meetings = (props) => {
    const showMeetingStatus = (status) => {
        if (status === 'pending') {
            return (
                <svg className={ classNames(styles.statusIcon, styles.statusPending) } width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0V4C6.23858 4 4 6.23858 4 9C4 11.7614 6.23858 14 9 14C11.7614 14 14 11.7614 14 9H18Z" fill="url(#paint0_linear_1209_535)"/>
                    <defs>
                        <linearGradient id="paint0_linear_1209_535" x1="9" y1="9" x2="18" y2="9" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FFAC25"/>
                            <stop offset="1" stopColor="#FFAC25" stopOpacity="0"/>
                        </linearGradient>
                    </defs>
                </svg>
            );
        }
        else if (status === 'done') {
            return (
                <svg className={ styles.statusIcon } width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.44364 6.99996C0.662587 6.21892 0.662587 4.95259 1.44364 4.17154C2.22468 3.39049 3.49101 3.39049 4.27206 4.17154L9.92892 9.82839C10.71 10.6094 10.71 11.8758 9.92892 12.6568C9.14787 13.4379 7.88154 13.4379 7.10049 12.6568L1.44364 6.99996Z" fill="#49AB26"/>
                    <path d="M15.5858 1.34311C16.3668 0.562062 17.6332 0.562062 18.4142 1.34311C19.1952 2.12416 19.1952 3.39049 18.4142 4.17154L9.92892 12.6568C9.14787 13.4379 7.88154 13.4379 7.10049 12.6568C6.31944 11.8758 6.31944 10.6094 7.10049 9.82839L15.5858 1.34311Z" fill="#49AB26"/>
                </svg>

            );
        }
        else if (status === 'error') {
            return (
                <svg className={ styles.statusIcon } width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.612039 3.56722C-0.204013 2.75117 -0.204013 1.42809 0.612039 0.612039C1.42809 -0.204013 2.75117 -0.204013 3.56722 0.612039L15.388 12.4328C16.204 13.2488 16.204 14.5719 15.388 15.388C14.5719 16.204 13.2488 16.204 12.4328 15.388L0.612039 3.56722Z" fill="#FF5100"/>
                    <path d="M3.56722 15.388C2.75117 16.204 1.42809 16.204 0.612039 15.388C-0.204013 14.5719 -0.204013 13.2488 0.612039 12.4328L12.4328 0.612039C13.2488 -0.204013 14.5719 -0.204013 15.388 0.612039C16.204 1.42809 16.204 2.75117 15.388 3.56722L3.56722 15.388Z" fill="#FF5100"/>
                </svg>
            );
        } 
    };

    const getMeetings = (meetings) => {
        if (meetings) {
            const formattedMeetings = Object.keys(meetings).map(
                (key) => {
                    if (meetings[key]) {
                        return (
                            <Link to={ routing.mainPage + '/' + key } key={ key }>
                                <div className={ styles.meetingCard }>
                                    <p className={ styles.meetingTitle }>Название встречи {key}</p>
                                    <div className={ styles.meetingDateContainer }>
                                        <p className={ styles.meetingDate }>23.11.2024</p>
                                        { showMeetingStatus('done') }
                                    </div>
                                </div>
                            </Link>
                        );
                    }
                    else {
                        return (
                            <div className={ styles.meetingCard } key={ key }>
                                <p className={ styles.meetingTitle }>Название встречи {key}</p>
                                <div className={ styles.meetingDateContainer }>
                                    <p className={ styles.meetingDate }>23.11.2024</p>
                                    { showMeetingStatus('pending') }
                                </div>
                            </div>
                        );
                    }
                }
            )
            return formattedMeetings;
        }
    };
    return (
        <div className={ styles.content }>
            { getMeetings(props.meetings) }
        </div>
    );
}; 


const MainPage = (props) => {
    const [meetings, setMeetings] = useState(undefined);
    const [files, setFiles] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
 
    const showMeetingStatus = (status) => {
        if (status === 'pending') {
            return (
                <svg className={ classNames(styles.statusIcon, styles.statusPending) } width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0V4C6.23858 4 4 6.23858 4 9C4 11.7614 6.23858 14 9 14C11.7614 14 14 11.7614 14 9H18Z" fill="url(#paint0_linear_1209_535)"/>
                    <defs>
                        <linearGradient id="paint0_linear_1209_535" x1="9" y1="9" x2="18" y2="9" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FFAC25"/>
                            <stop offset="1" stopColor="#FFAC25" stopOpacity="0"/>
                        </linearGradient>
                    </defs>
                </svg>
            );
        }
        else if (status === 'done') {
            return (
                <svg className={ styles.statusIcon } width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.44364 6.99996C0.662587 6.21892 0.662587 4.95259 1.44364 4.17154C2.22468 3.39049 3.49101 3.39049 4.27206 4.17154L9.92892 9.82839C10.71 10.6094 10.71 11.8758 9.92892 12.6568C9.14787 13.4379 7.88154 13.4379 7.10049 12.6568L1.44364 6.99996Z" fill="#49AB26"/>
                    <path d="M15.5858 1.34311C16.3668 0.562062 17.6332 0.562062 18.4142 1.34311C19.1952 2.12416 19.1952 3.39049 18.4142 4.17154L9.92892 12.6568C9.14787 13.4379 7.88154 13.4379 7.10049 12.6568C6.31944 11.8758 6.31944 10.6094 7.10049 9.82839L15.5858 1.34311Z" fill="#49AB26"/>
                </svg>

            );
        }
        else if (status === 'error') {
            return (
                <svg className={ styles.statusIcon } width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.612039 3.56722C-0.204013 2.75117 -0.204013 1.42809 0.612039 0.612039C1.42809 -0.204013 2.75117 -0.204013 3.56722 0.612039L15.388 12.4328C16.204 13.2488 16.204 14.5719 15.388 15.388C14.5719 16.204 13.2488 16.204 12.4328 15.388L0.612039 3.56722Z" fill="#FF5100"/>
                    <path d="M3.56722 15.388C2.75117 16.204 1.42809 16.204 0.612039 15.388C-0.204013 14.5719 -0.204013 13.2488 0.612039 12.4328L12.4328 0.612039C13.2488 -0.204013 14.5719 -0.204013 15.388 0.612039C16.204 1.42809 16.204 2.75117 15.388 3.56722L3.56722 15.388Z" fill="#FF5100"/>
                </svg>
            );
        } 
    };
    // Получаем все встречи 
    useEffect(() => {
        if (!meetings && !isLoading) {
            fetch(api.usersGetMeets, {
                credentials: 'include',
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
            }).then((data) => {
                if (!meetings) {
                    console.log(data);
                    setMeetings(data);
                }                
            })
    }});

    useEffect(() => console.log(123), [])
    

    const handleDropFile = (e) => {
        e.preventDefault();

        const fileInput = document.querySelector(`.${styles.fileFormFilesField} input`);
        fileInput.files = e.dataTransfer.files;
    };

    const handleChooseFileByClick = (e) => {
        e.preventDefault();
        let fileInput = e.target.closest('div').querySelector('input');
        fileInput.click()
    };

    const handleRemoveFile = (e) => {
        e.preventDefault();
        setFiles(undefined);
    };

    const handleFilesChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSendFile = (e) => {
        e.preventDefault();

        setMeetings(Object.assign({}, meetings, { 0: {text: ''} }));

        const file = new FormData();
        file.append('file', files[0])
        fetch(api.usersUploadFile, {
            method: 'POST',
            credentials: 'include',
            body: file,
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
        }).then((data) => fetch(`http://localhost:8081/process-file/?file_name=${data.hash_file_name}&file_type=wav`, {
            method: 'POST',
            credentials: 'include',
        }))
    };

    return (
        <div className={ styles.page }>
            <div>
                <p className={ styles.title }>Ваши встречи</p>
                <div className={ styles.panel }>
                    <Meetings meetings={ meetings } />
                    <form className={ styles.fileForm }>
                        <input className={ styles.fileFormMeetingName } type="text" placeholder='Введите название...'/>
                        <div className={ styles.fileFormFilesField } onDrop={ handleDropFile } onDragOver={(e) => {e.preventDefault()}}>
                            <svg width="48" height="73" viewBox="0 0 48 73" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 12.5C0 5.87258 5.37258 0.5 12 0.5H36L48 14V60.5C48 67.1274 42.6274 72.5 36 72.5H12C5.37258 72.5 0 67.1274 0 60.5V12.5Z" fill="white"/>
                                <path d="M36 0.5L48 14H43.5C36 14 36 8.31371 36 5V0.5Z" fill="#4D4D4D"/>
                            </svg>
                            <p><a href='#' onClick={ handleChooseFileByClick }>Click to upload</a> or 
                            drag and drop</p>
                            <input onChange={ handleFilesChange } type='file' hidden/>
                            <p className={ styles.costraintMaxSize }>Maximum file size 500MB.</p>
                        </div>
                        <button onClick={ handleRemoveFile }>Удалить</button>
                        <button onClick={ handleSendFile }>Отправить</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MainPage;