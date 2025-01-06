import styles from './Message.module.css'


const Message = (props) => {
    const messageInfo = props.messageInfo;
    const titleObj = messageInfo.title;
    const textObj = messageInfo.text;
    const messageTitle = (titleObj.get) ? titleObj.get: 'Уведомление';
    const messageText = (textObj.get) ? textObj.get: 'Действие совершено';

    const handleCloseMessage = () => {
        props.shown.set(false);
        titleObj.set('');
        textObj.set('');
    };

    if (props.shown.get) {
        return (
            <div className={ styles.messageContainer }>
                <div className={ styles.infoContainer }>
                    <p className={ styles.messageTitle }>{ messageTitle }</p>
                    <p className={ styles.messageText }>{ messageText }</p>
                </div>
                <button className={ styles.messageOkBtn } onClick={ handleCloseMessage }>ОК</button>
            </div>
        );
    }
};

export default Message;