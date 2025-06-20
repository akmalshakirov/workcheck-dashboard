import { useEffect } from "react";

const DashboardProfile = () => {
    useEffect(() => {
        document.title = "WorkCheck - Dashboard | Mening profilim";
    }, []);
    return <div>DashboardProfile</div>;
};

export default DashboardProfile;
