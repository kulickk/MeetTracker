import { fullLogout } from "../../../utils/userData/userData.js";
import api from "../../../utils/links/api.js";
import routing from "../../../utils/links/routing.js";


async function getMeet(setter, filename, navigate) {
    try {
        const response = await fetch(api.usersGetMeet + `?file_name=${filename}`, {
            credentials: 'include',
        });
        if (response.ok) {
            const data = await response.json();
            setter(data);
            return;
        }
        // issues
        if (response.status === 401) {
            fullLogout();
            navigate(routing.authentidication);
            return;
        }
    } catch (err) {

    }
};

export { getMeet };