import api from "../../../utils/links/api";
import routing from "../../../utils/links/routing";
import { fullLogout } from "../../../utils/userData/userData";


const getUsers = async (userData, users, setUsers, navigate) => {
    try {
        const response = await fetch(api.adminGetUsers, {
            credentials: 'include',
        })

        if (response.ok) {
            const data = await response.json()
            if (!users) {
                setUsers(data)
            }
            return false;
        }
        if (response.status === 401) {
            fullLogout(userData, { logout: true });
            navigate(routing.authentidication);
            return true;
        }
    } catch {

    }
}

export { getUsers };