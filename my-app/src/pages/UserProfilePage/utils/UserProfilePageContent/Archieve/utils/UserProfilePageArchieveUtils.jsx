import downloadFile from './UserProfilePageArchieveRequests';

import styles from './../UserProfilePageArchieve.module.css'

const handleDownloadFile = (e) => {
    const meetContainer = e.target.closest(`.${styles.meetingCard}`);
    const filename = meetContainer.querySelector('input[name="meet_name"]').value;
    const filetype = meetContainer.querySelector('input[name="meet_type"]').value;
    downloadFile(filename, filetype);
};


const ArchieveMeetings = (props) => {
    const getArchieveMeetings = (meetings) => {
        if (meetings) {
            const formattedMeetings = meetings.map(
                (value, index) => {
                        const [year, month, day] = meetings[index]['uploaded_at'].split('T')[0].split('-');
                        const date = [day, month, year].join('.');
                        return (
                                <div className={ styles.meetingCard } key={ index }>
                                    <p className={ styles.meetingTitle }>{ meetings[index]['meet_name'] }</p>
                                    <div className={ styles.meetingDateContainer }>
                                        <p className={ styles.meetingDate }>{ date }</p>
                                        <div className={ styles.cardButtons }>
                                            <button onClick={ handleDownloadFile } className={ styles.downloadButton }>
                                                <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0 18.1806C0 17.1758 0.850659 16.3612 1.9 16.3612H17.1C18.1493 16.3612 19 17.1758 19 18.1806C19 19.1854 18.1493 20 17.1 20H1.9C0.850659 20 0 19.1854 0 18.1806Z" fill="#282828"/>
                                                    <path d="M9.50566 12.7358C8.45632 12.7358 7.60566 11.9213 7.60566 10.9164V1.81941C7.60566 0.814576 8.45632 4.76867e-07 9.50566 4.76867e-07C10.555 4.76867e-07 11.4057 0.814576 11.4057 1.81941V10.9164C11.4057 11.9213 10.555 12.7358 9.50566 12.7358Z" fill="#282828"/>
                                                    <path d="M10.8739 14.087C10.1319 14.7975 8.92887 14.7975 8.18687 14.087L2.81286 8.94093C2.07087 8.23041 2.07087 7.07842 2.81286 6.3679C3.55486 5.65738 4.75787 5.65738 5.49987 6.3679L10.8739 11.514C11.6159 12.2245 11.6159 13.3765 10.8739 14.087Z" fill="#282828"/>
                                                    <path d="M16.248 6.36789C16.99 7.07841 16.99 8.2304 16.248 8.94092L10.8739 14.087C10.1319 14.7975 8.92887 14.7975 8.18687 14.087C7.44488 13.3765 7.44494 12.2245 8.18694 11.5139L13.561 6.36789C14.3029 5.65737 15.506 5.65737 16.248 6.36789Z" fill="#282828"/>
                                                </svg>
                                            </button>
                                            <button className={ styles.deleteButton }>
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0.612039 3.56722C-0.204013 2.75117 -0.204013 1.42809 0.612039 0.612039C1.42809 -0.204013 2.75117 -0.204013 3.56722 0.612039L15.388 12.4328C16.204 13.2488 16.204 14.5719 15.388 15.388C14.5719 16.204 13.2488 16.204 12.4328 15.388L0.612039 3.56722Z" fill="#282828"/>
                                                    <path d="M3.56722 15.388C2.75117 16.204 1.42809 16.204 0.612039 15.388C-0.204013 14.5719 -0.204013 13.2488 0.612039 12.4328L12.4328 0.612039C13.2488 -0.204013 14.5719 -0.204013 15.388 0.612039C16.204 1.42809 16.204 2.75117 15.388 3.56722L3.56722 15.388Z" fill="#282828"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <input name='meet_name' value={ meetings[index]['meet_name'] } hidden readOnly/>
                                    <input name='meet_type' value={ meetings[index]['meet_type'] } hidden readOnly/>
                                </div>
                                );
                            }
                        )
            return formattedMeetings;
        }
    };
    return (
        <div className={ styles.content }>
            <div className={ styles.meetingsContainer }>
                { getArchieveMeetings(props.meetings) }
            </div>
            <div className={ styles.buttonsContainer }>
                <button className={ `admin-panel-button user-button` }>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 2C0 0.895431 0.895431 0 2 0C3.10457 0 4 0.895431 4 2V14C4 15.1046 3.10457 16 2 16C0.895431 16 0 15.1046 0 14V2Z" fill="#282828"/>
                        <path d="M6 2C6 0.895431 6.89543 0 8 0C9.10457 0 10 0.895431 10 2V14C10 15.1046 9.10457 16 8 16C6.89543 16 6 15.1046 6 14V2Z" fill="#282828"/>
                        <path d="M12 2C12 0.895431 12.8954 0 14 0C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16C12.8954 16 12 15.1046 12 14V2Z" fill="#282828"/>
                    </svg>
                    Архивировать все записи
                </button>
                <button className={ 'admin-panel-button delete-button' }>
                    <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.5 1C0.5 0.447715 0.947715 0 1.5 0H13.5C14.0523 0 14.5 0.447715 14.5 1C14.5 1.55228 14.0523 2 13.5 2H1.5C0.947716 2 0.5 1.55228 0.5 1Z" fill="white"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M13.5 3H1.5L3.26858 16.2643C3.40106 17.2579 4.24863 18 5.25103 18H9.74897C10.7514 18 11.5989 17.2579 11.7314 16.2643L13.5 3ZM4.95088 13.5579C4.97884 13.8096 5.19157 14 5.44478 14C5.74097 14 5.97139 13.7426 5.93869 13.4482L5.04912 5.44206C5.02116 5.1904 4.80843 5 4.55522 5C4.25903 5 4.02861 5.25745 4.06131 5.55182L4.95088 13.5579ZM9.55522 14C9.80843 14 10.0212 13.8096 10.0491 13.5579L10.9387 5.55182C10.9714 5.25745 10.741 5 10.4448 5C10.1916 5 9.97884 5.1904 9.95088 5.44206L9.06131 13.4482C9.02861 13.7426 9.25903 14 9.55522 14ZM8 13.5C8 13.7761 7.77614 14 7.5 14C7.22386 14 7 13.7761 7 13.5V5.5C7 5.22386 7.22386 5 7.5 5C7.77614 5 8 5.22386 8 5.5V13.5Z" fill="white"/>
                    </svg>
                    Удалить все записи
                </button>
            </div>
        </div>
    );
}; 

export default ArchieveMeetings;