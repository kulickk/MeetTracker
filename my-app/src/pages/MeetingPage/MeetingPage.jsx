import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Header from '../../components/Header/Header.jsx';
import { Speakers, Meet } from './utils/MeetingPageUtils.jsx';
import { getMeet } from './utils/MeetingPageRequests.jsx';
import wisper from '../../utils/links/wisper.js';
import routing from '../../utils/links/routing.js';
import { fullLogout } from '../../utils/userData/userData.js';

import styles from './MeetingPage.module.css'


const MeetingPage = (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const [meeting, setMeeting] = useState({status: '', meet_name: '', meet_type: '', transcription: [], summarization: {}, uploaded_at: ''});

    useEffect(() => {
        if (!meeting.status) {
            getMeet(setMeeting, params.file_name, navigate);
        }
    }, []);

    const handleLoadAgain = async (e) => {
        try {
            const response = await fetch(wisper.loadAgain + params.file_name, {
                method: 'post',
                credentials: 'include'
            });
            if (response.ok) {
                navigate(routing.mainPage);
                return;
            }
            if (response.status === 401) {
                fullLogout(props.userData, {logout: true});
                navigate(routing.authentidication);
                return;
            }
        } catch {

        }
    };

    if (meeting.summary_status) {
        const [year, month, day] = meeting['uploaded_at'].split('T')[0].split('-');
        const date = [day, month, year].join('.');
        return (
            <>
            <Header userName={ props.userData.userName }/>
            <div className={ styles.page }>
               <div className={ styles.content }>
                    <div className={ styles.titleContainer }>
                        <p className={ styles.title }>{params.file_name}</p>
                        <p className={ styles.date }>{date}</p>
                    </div>
                    <div className={ styles.meetingsContainer }>
                        <Speakers meet={ meeting['summarization']['data']['speakers'] } />
                    </div>
                    <div className={ styles.meetingSummary }>
                        <Meet meet={ meeting['summarization']['data']['meet'] } />
                    </div>
                    <button className={ `admin-panel-button user-button ${styles.againButton}` } onClick={ handleLoadAgain }>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.1512 10.9181C14.3002 10.9181 13.5995 11.5217 13.159 12.2219C12.4096 13.4129 11.0497 14.209 9.49639 14.209C7.94313 14.209 6.58322 13.4129 5.83381 12.2219C5.39324 11.5217 4.69258 10.9181 3.84154 10.9181C2.77543 10.9181 1.93128 11.8239 2.31786 12.7794C3.43564 15.542 6.22824 17.5 9.49639 17.5C12.7645 17.5 15.5571 15.542 16.6749 12.7794C17.0615 11.8239 16.2174 10.9181 15.1512 10.9181Z" fill="#282828"/>
                            <path d="M1.56674 9.45087C1.88995 8.5969 2.87185 8.15659 3.75988 8.46741C4.6479 8.77823 5.10577 9.72248 4.78256 10.5764L3.31948 14.4421C2.99626 15.296 2.01436 15.7363 1.12634 15.4255C0.238312 15.1147 -0.219557 14.1704 0.103658 13.3165L1.56674 9.45087Z" fill="#282828"/>
                            <path d="M2.58942 11.5599C1.70139 11.2491 1.24352 10.3048 1.56674 9.45087C1.88995 8.5969 2.87185 8.15659 3.75988 8.46741L7.77966 9.87438C8.66768 10.1852 9.12555 11.1294 8.80233 11.9834C8.47912 12.8374 7.49722 13.2777 6.60919 12.9669L2.58942 11.5599Z" fill="#282828"/>
                            <path d="M2.84875 7.08191C3.6998 7.08191 4.40046 6.4783 4.84103 5.7781C5.59043 4.58705 6.95035 3.79096 8.50361 3.79096C10.0569 3.79096 11.4168 4.58705 12.1662 5.7781C12.6068 6.4783 13.3074 7.08191 14.1585 7.08191C15.2246 7.08191 16.0687 6.17609 15.6821 5.22064C14.5644 2.45797 11.7718 0.5 8.50361 0.5C5.23546 0.5 2.44286 2.45797 1.32508 5.22064C0.938501 6.17609 1.78265 7.08191 2.84875 7.08191Z" fill="#282828"/>
                            <path d="M16.4333 8.54913C16.11 9.4031 15.1281 9.84341 14.2401 9.53259C13.3521 9.22177 12.8942 8.27752 13.2174 7.42356L14.6805 3.55795C15.0037 2.70398 15.9856 2.26367 16.8737 2.57449C17.7617 2.88531 18.2196 3.82956 17.8963 4.68352L16.4333 8.54913Z" fill="#282828"/>
                            <path d="M15.4106 6.4401C16.2986 6.75092 16.7565 7.69516 16.4333 8.54913C16.11 9.4031 15.1281 9.84341 14.2401 9.53259L10.2203 8.12562C9.33232 7.8148 8.87445 6.87056 9.19767 6.01659C9.52088 5.16262 10.5028 4.72232 11.3908 5.03313L15.4106 6.4401Z" fill="#282828"/>
                        </svg>
                        Заново
                    </button>
               </div>
            </div>
            </>
        );
    }
};

export default MeetingPage;