import { useEffect } from "react";

const DashboardWorkers = () => {
    useEffect(() => {
        document.title = "WorkCheck - Dashboard | Ishchilar";
    }, []);
    return <div>DashboardWorkers</div>;
};

export default DashboardWorkers;
