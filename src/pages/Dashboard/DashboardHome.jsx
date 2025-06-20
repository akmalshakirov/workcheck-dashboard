import { useEffect } from "react";

const DashboardHome = () => {
    useEffect(() => {
        document.title = "WorkCheck - Dashboard";
    }, []);
    return <div>DashboardHome</div>;
};

export default DashboardHome;
