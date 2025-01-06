import { Navigate } from "react-router-dom";
import routing from "../../utils/links/routing";

const NotFoundPage = () => {
    return (
        <Navigate to={ routing.mainPage } />
    );
};

export default NotFoundPage;