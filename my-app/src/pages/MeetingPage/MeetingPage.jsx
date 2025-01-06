import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Header from '../../components/Header/Header.jsx';
import { Speakers, Meet } from './utils/MeetingPageUtils.jsx';
import { getMeet } from './utils/MeetingPageRequests.jsx';

import styles from './MeetingPage.module.css'


const MeetingPage = (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const [meeting, setMeeting] = useState({status: '', meet_name: '', meet_type: '', transcription: [], summarization: {}, uploaded_at: ''}
);
    useEffect(() => {
        if (!meeting.status) {
            getMeet(setMeeting, params.file_name, navigate);
        }
    }, []);
    if (meeting.status) {
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
               </div>
            </div>
            </>
        );
    }
};

export default MeetingPage;