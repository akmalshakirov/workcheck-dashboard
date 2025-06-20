import { useEffect } from "react";
import Dropdown from "../../components/ui/Dropdown/Dropdown";

const DashboardAdmins = () => {
    useEffect(() => {
        document.title = "WorkCheck - Dashboard | Adminlar";
    }, []);

    const dropdownOptions = [
        { value: "option1", label: "Birinchi variant" },
        { value: "option2", label: "Ikkinchi variant" },
        { value: "option3", label: "Uchinchi variant" },
        { value: "option4", label: "Toʻrtinchi variant" },
        { value: "option5", label: "Beshinchi variant" },
    ];
    return (
        <div>
            <Dropdown
                options={dropdownOptions}
                placeholder='Viloyatni tanlang'
            />
        </div>
    );
};

export default DashboardAdmins;
