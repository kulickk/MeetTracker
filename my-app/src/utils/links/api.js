const dommen = 'http://localhost:8000/';

const api = {
    register: 'auth/register',
    test: 'auth/health',
    logIn: 'auth/token',
    logout: 'auth/logout',
    adminGetUsers: 'admin/get_users',
    adminBanUser: 'admin/ban_user',
    adminMakeUserAdmin: 'admin/set_admin',
    adminRegisterUser: 'admin/register',
    usersGetFile: 'users/check-file',
    usersUploadFile: 'users/upload-file',
    usersGetMeets: 'users/get-user-meets',
    usersGetMeet: 'users/check-file',
    usersMe: 'users/me',
    downloadFile: 'users/download-file',
    updateInfo: 'users/update-user-info'
};

Object.keys(api).forEach((key) => {
    api[key] = dommen + api[key];
});

export default api;