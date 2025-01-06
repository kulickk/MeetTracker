import { Link } from 'react-router-dom';

import routing from '../../../utils/links/routing.js';

import styles from '../MainPage.module.css'

const MAXFILESIZE = 1024 * 1024 * 500;
const videoExtensions = [
    "MP4",
    "MOV",
    "WMV",
    "AVI",
    "AVCHD",
    "FLV",
    "F4V",
    "SWF",
    "MKV",
    "WEBM",
    "MPEG-2"
];

const audioExtensions = [
    "MP3",
    "WMA",
    "AAC",
    "WAV",
    "FLAC",
    "AIFF",
    "OGG"
];

const showMeetingStatus = (status) => {
    if (status === 'pending') {
        return (
            <svg className={ `${styles.statusIcon} ${styles.statusPending}` } width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const Meetings = (props) => {
    const getMeetings = (meetings) => {
        if (meetings) {
            const formattedMeetings = meetings.map(
                (value, index) => {
                    if (meetings[index]) {
                        const [year, month, day] = meetings[index]['uploaded_at'].split('T')[0].split('-');
                        const date = [day, month, year].join('.');
                        return (
                            <Link to={ routing.mainPage + '/' + index + `/${value['meet_name']}` } key={ index }>
                                <div className={ styles.meetingCard }>
                                    <p className={ styles.meetingTitle }>{ meetings[index]['meet_name'] }</p>
                                    <div className={ styles.meetingDateContainer }>
                                        <p className={ styles.meetingDate }>{ date }</p>
                                        { showMeetingStatus('done') }
                                    </div>
                                </div>
                            </Link>
                        );
                    }
                    else {
                        return (
                            <div className={ styles.meetingCard } key={ index }>
                                <p className={ styles.meetingTitle }>Название встречи {index}</p>
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

const getFileSizeUnits = (fileSize) => {
    const getSize = (size) => {
        if (size < 1024) {
            return [size, 'Б']
        } else if (size >= 1024) {
            let newSize = size / 1024;
            if (newSize < 1024) {
                return [newSize, 'КБ']
            } else if (newSize >= 1024) {
                newSize /= 1024;
                if (newSize < 1024) {
                    return [newSize, 'МБ']
                } else if (newSize >= 1024) {
                    newSize /= 1024;
                    return [newSize, 'ГБ']
                }
            }
        }
    };
    const [size, units] = getSize(fileSize);
    return `${Math.ceil(size)}${units}`
};

const FileUploadForm = (props) => {
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

    const handleFilesChange = (e) => {
        const extention = e.target.files[0].name.split('.').pop().toUpperCase();
        console.log(extention);
        if (videoExtensions.includes(extention) || audioExtensions.includes(extention)) {
            if (e.target.files[0].size < MAXFILESIZE) {
                props.setFiles(e.target.files);
            }
        }
    };
    console.log(props.files);
    if (props.files) {
        return (
            <>
            <div className={ styles.fileFormFilesContainer }>
                <div className={ styles.fileList }>
                    <div className={ styles.fileRow }>
                        <p className={ styles.fileName }>{ props.files[0].name }</p>
                        <p className={ styles.fileSize }>{ getFileSizeUnits(props.files[0].size) }</p>
                    </div>
                </div>
            </div>
            </>
        );
    };

    return (
        <>
        <div className={ styles.fileFormFilesContainer } onDrop={ handleDropFile } onDragOver={(e) => {e.preventDefault()}}>
            <div className={ styles.fileFormFilesInput }>
                <svg width="48" height="73" viewBox="0 0 48 73" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 12.5C0 5.87258 5.37258 0.5 12 0.5H36L48 14V60.5C48 67.1274 42.6274 72.5 36 72.5H12C5.37258 72.5 0 67.1274 0 60.5V12.5Z" fill="white"/>
                    <path d="M36 0.5L48 14H43.5C36 14 36 8.31371 36 5V0.5Z" fill="#4D4D4D"/>
                </svg>
                <p><a href='#' onClick={ handleChooseFileByClick }>Click to upload</a> or<br/>
                drag and drop</p>
                <input onChange={ handleFilesChange } type='file' hidden accept='video/*,audio/*'/>
                <p className={ styles.costraintMaxSize }>Maximum file size 500MB.</p>
            </div>
        </div>
        </>
    );
};

export { Meetings, FileUploadForm };