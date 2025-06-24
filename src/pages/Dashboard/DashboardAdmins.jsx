import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../App";
import Table from "../../components/ui/Table/Table";

const DashboardAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getAdmins = async () => {
            try {
                const response = await axios.get(`${baseURL}/admins`, {
                    withCredentials: true,
                });

                setAdmins(response.data.admins);
                console.log(response.data.admins);
            } catch (error) {
                if (error.response.data.status === 401) {
                    navigate("/login");
                }
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
