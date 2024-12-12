const dommen = 'http://localhost:8000/';

const api = {
    register: 'auth/register',
    test: 'auth/health',
    users: 'auth/users/me',
    logIn: 'auth/token',
    adminGetUsers: 'admin/get_users',
    adminBanUser: 'admin/ban_user',
    adminMakeUserAdmin: 'admin/set_admin',
    adminRegisterUser: 'admin/register',
    usersGetFile: 'users/check-file',
    usersUploadFile: 'users/upload-file',
    usersGetMeets: 'users/get-user-meets',
};

Object.keys(api).forEach((key) => {
    api[key] = dommen + api[key];
});

export default api;