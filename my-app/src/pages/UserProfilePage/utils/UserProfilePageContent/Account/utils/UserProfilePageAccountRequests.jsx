import api from "../../../../../../utils/links/api";
import { showMessage } from "../../../../../../utils/message.js";


const changeAccountInfo = async (data, setUsername, shown, title, text) => {
    try {
        const responseChangeInfo = await fetch(api.updateInfo, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!responseChangeInfo.ok) {
            const responseErrorMessage = await responseChangeInfo.json();
            throw new Error(responseErrorMessage.detail);
        }
        const responseMe = await fetch(api.usersMe, {credentials: 'include'});
        if (!responseMe.ok) {
            const responseErrorMessage = await responseChangeInfo.json();
            throw new Error(responseErrorMessage.detail);
        }
        const dataMe = await responseMe.json();
        const username = [dataMe.surname, dataMe.name, dataMe.patronymic].join(' ');
        window.localStorage.setItem('login', username);
        setUsername(username);
        showMessage(shown, title, text, 'Уведомление', 'Изменения сохранены');
    } catch (err) {
        showMessage(shown, title, text, 'Ошибка', err.message);
    }
};

export default changeAccountInfo;