import api from "../../../../../../utils/links/api"


const downloadFile = async (filename, filetype) => {
    try {
        const response = await fetch(api.downloadFile +`?file_name=${filename}&file_type=${filetype}`, {
            credentials: 'include'
        });
        if (response.ok) {
            console.log('DOWNLOAD');
            console.log(await response.data);
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

export default downloadFile;