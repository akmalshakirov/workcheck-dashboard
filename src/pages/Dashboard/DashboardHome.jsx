import { useEffect } from "react";
import Dropdown from "../../components/ui/Dropdown/Dropdown";

const DashboardHome = () => {
    useEffect(() => {
        document.title = "WorkCheck - Dashboard";
    }, []);
    return <div>DashboardHome</div>;
};

export default DashboardHome;
