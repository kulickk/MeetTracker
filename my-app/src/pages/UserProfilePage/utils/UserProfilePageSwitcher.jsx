import Users from "./UserProfilePageContent/Users/UserProfilePageUsers.jsx";
import Config from "./UserProfilePageContent/Config/UserProfilePageConfig.jsx";
import Account from "./UserProfilePageContent/Account/UserProfilePageAccount.jsx";
import Archieve from "./UserProfilePageContent/Archieve/UserProfilePageArchieve.jsx";


const ContentSwitcher = (props) => {
    if (props.content === 'users') {
        return <Users 
        users={ props.users } 
        setUsers={ props.setUsers } 
        userData={ props.userData }
        // Сообщения
        shown={ props.shown }
        messageInfo={ props.messageInfo }/>;
    }
    if (props.content === 'config') {
        return <Config 
        // Сообщения
        shown={ props.shown }
        messageInfo={ props.messageInfo }/>;
    }
    if (props.content === 'account') {
        return <Account 
        users={ props.users } 
        setUsers={ props.setUsers } 
        userData={ props.userData }
        // Сообщения
        shown={ props.shown }
        messageInfo={ props.messageInfo }/>;
    }
    if (props.content === 'archieve') {
        return <Archieve 
        // Сообщения
        shown={ props.shown }
        messageInfo={ props.messageInfo }/>;
    }
};

export default ContentSwitcher;