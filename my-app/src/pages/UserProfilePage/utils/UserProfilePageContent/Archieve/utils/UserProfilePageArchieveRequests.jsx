import { getMeets } from "../../../../../MainPage/utils/MainPageRequests";

import api from "../../../../../../utils/links/api"


const downloadFile = async (filename, filetype) => {
    try {
        const response = await fetch(api.downloadFile +`?file_name=${filename}&file_type=${filetype}`, {
            credentials: 'include'
        });
        if (response.ok) {
            const blob = await response.blob();
            const a = document.createElement('a');
            a.style.display = 'none';
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = `${filename}.${filetype}`;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        }

    } catch {

    }
};

const deleteFile = async (filename, setter, navigate) => {
    try {
        const response = await fetch(api.usersDeleteFile + filename, {
            method: 'delete',
            credentials: 'include'
        })
        if (response.ok) {
            getMeets(setter, navigate)
        }
    } catch {

    }
};

export { downloadFile, deleteFile };