import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ArchieveMeetings from "./utils/UserProfilePageArchieveUtils";
import { getMeets } from "../../../../MainPage/utils/MainPageRequests";

const Archieve = (props) => {
    const [meetings, setMeetings] = useState(undefined);
    const navigate = useNavigate;

    useEffect(() => {
        if (!meetings) {
            getMeets(setMeetings, navigate);
    }});
    
    return (
        <div>
            <ArchieveMeetings meetings={ meetings }/>
        </div>
    );
};

export default Archieve;