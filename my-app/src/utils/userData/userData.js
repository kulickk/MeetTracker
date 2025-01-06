import api from "../links/api";


const RESETVALUESLIST = {
    'boolean': false,
    'string': ''
    }


const logout = (userData) => {
    window.localStorage.clear();

    fetch(api.logout, { 
        method: 'post',
        credentials: 'include' 
    });
    
    Object.keys(userData).forEach((key) => {
    const category = userData[key]
    const [value, setter] = Object.values(category);
    setter(RESETVALUESLIST[typeof value]);
    // console.log(value, RESETVALUESLIST[typeof value]);
    });
};


const fullLogout = (userData, params={ logout: false }) => {
    if (params.logout) {
        console.log('Разлогинился');
        logout(userData);
        return;
    }
    console.log('fhjdosigu1 841204712');
};

export { fullLogout };