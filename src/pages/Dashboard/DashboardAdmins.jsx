import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { baseURL } from "../../App";
import Table from "../../components/ui/Table/Table";

const DashboardAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const getAdmins = async () => {
            try {
                const resposne = await axios.get(`${baseURL}/admins`, {
                    withCredentials: true,
                });

                setAdmins(resposne.data.admins);
                console.log(resposne.data.admins);
            } catch (error) {
                console.log(error);
            }
        };
        getAdmins();
        document.title = "WorkCheck - Dashboard | Adminlar";
    }, []);

    return (
        <div>
            <div>
                <Table data={admins} />
            </div>
        </div>
    );
};

export default DashboardAdmins;
