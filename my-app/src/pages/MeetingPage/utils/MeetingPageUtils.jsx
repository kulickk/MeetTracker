import styles from '../MeetingPage.module.css'


const Speakers = (props) => {
    const getSpeakers = (speakers) => {
        if (speakers) {
            const speakersCards = Object.keys(speakers).map((key) => {
                console.log(key);
                return (
                    <div className={ styles.speakerContainer } key={ key }>
                        <p className={ styles.speakerTitle }>{ key }</p>
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
            { getSpeakers(props.meet) }
        </div>
    );
};

const Meet = (props) => {
    const getMeetSummary = (meet) => {
        if (meet) {
            return meet.map((element, index) => {
                return (
                    <li key={index}>{element}</li>
                );
            });
        }
    }
    return (
        <>
            <ul>
                { getMeetSummary(props.meet) }
            </ul>
        </>
    );
};

export { Speakers, Meet };