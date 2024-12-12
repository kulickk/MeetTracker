import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import api from '../../api';
import styles from './MeetingPage.module.css'

const Speakers = (props) => {
    const getSpeakers = (speakers) => {
        if (speakers) {
            const speakersCards = Object.keys(speakers).map((key) => {
                return (
                    <div className={ styles.speakerContainer } key={ key }>
                        <p className={ styles.speakerTitle }>Участник { key }</p>
                        <ul className={ styles.speakerPhrasesList }>
                            { speakers[key].map((element) => <li className={ styles.speakerPhrasesListItem } key={ speakers[key].indexOf(element) } >{ element }</li>) }
                        </ul>
                    </div>
                );
            })
            return speakersCards;
        }
    };

    return (
        <div className={ styles.meetingsContainer }>
            { getSpeakers(props.speakers) }
        </div>
    );
};

const MeetingPage = (props) => {
    const params = useParams();
    const [meeting, setMeeting] = useState({text: ''});
    const [speakers, setSpeakers] = useState(undefined);

    if (meeting.text !== '') {
       if (!speakers) {
        const result = meeting.segments.reduce((acc, segment) => {
            // Если спикер еще не добавлен в объект, создаем новый массив 
            if (!acc[segment.speaker]) {
                acc[segment.speaker] = [];
            }
            // Добавляем текст сегмента в массив соответствующего спикера
            acc[segment.speaker].push(segment.text);
            return acc;
        }, {});
        setSpeakers(result);
       }
    };

    useEffect(() => {
        if (meeting.text === '') {
            fetch(api.usersGetMeets, {
                credentials: 'include',
            }).then((response) => response.json()).then((data) => setMeeting(data[params.id]));
        }
    });
    console.log(meeting);
    
    return (
        <div className={ styles.page }>
           <div className={ styles.content }>
                <div className={ styles.titleContainer }>
                    <p className={ styles.title }>Название встречи {params.id}</p>
                    <p className={ styles.date }>23.11.2024</p>
                </div>
                <div className={ styles.meetingsContainer }>
                    {/* Спикер */}
                    <Speakers speakers={ speakers } />
                </div>
                <div className={ styles.meetingSummary }>
                    { meeting.text }
                </div>
           </div>
        </div>
    );
};

export default MeetingPage;