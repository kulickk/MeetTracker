import { fullLogout } from "../../../utils/userData/userData.js";
import { showMessage } from "../../../utils/message.js";
import api from "../../../utils/links/api.js";
import routing from "../../../utils/links/routing.js";


const getMeets = async (setter, navigate) => {
    try {
        const response = await fetch(api.usersGetMeets, {
            credentials: 'include',
        });
        if (response.status === 401) {
            fullLogout();
            navigate(routing.authentidication);
            return;
        }
        const data = await response.json();
        setter(data['meets']);
    } catch (err) {
        console.log('Ошибка при запросе', err);
    }
};


const sendFile = async (data, senderButton, navigate, setter, shown, title, text) => {
    try {
        const file = new FormData();
        file.append('file', data)
        const response = await fetch(api.usersUploadFile, {
            method: 'POST',
            credentials: 'include',
            body: file,
        });
        if (response.status === 401) {
            fullLogout();
            navigate(routing.authentidication);
            return;
        }
        if (!response.ok) {
            const responseErrorMessage = await response.json();
            throw new Error(responseErrorMessage.detail);
        }
        showMessage(shown, title, text, 'Уведомление', 'Встреча загружена');
        getMeets(setter, navigate)
    } catch (err) {
        showMessage(shown, title, text, 'Ошибка', err.message);
    }
    senderButton.disabled = false;
};


export { getMeets, sendFile };