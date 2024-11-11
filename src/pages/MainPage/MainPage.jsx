import api from "../../api";


const MainPage = (props) => {
    return (
        <div>
            ГЛАВНАЯ СТРАНИЦА
            <button onClick={props.handleLogOut}>LogOut</button>
            {props.token}
            <button onClick={
                e => {
                    fetch(api.users, {
                        method: 'GET',
                        credentials: 'include',
                    })
                }
            }>User</button>
        </div>
    );
};

export default MainPage;