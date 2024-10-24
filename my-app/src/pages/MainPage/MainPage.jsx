const MainPage = (props) => {
    return (
        <div>
            ГЛАВНАЯ СТРАНИЦА
            <button onClick={props.handleLogOut} >LogOut</button>
            {props.token}
        </div>
    );
};

export default MainPage;