import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { baseURL } from "../../App";
import Preloader from "../../components/ui/Preloader/Preloader";

const DashboardAdmins = () => {
    const token = localStorage.getItem("token");
    const [admins, setAdmins] = useState([]);
    const [preloader, setPreloader] = useState(false);

    const getAdmins = async () => {
        setPreloader(true);
        try {
            const response = await axios.get(`${baseURL}/admins`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setAdmins(response?.data?.admins);
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                toast.info("Internet aloqasi yo'q");
            } else if (error.response.status === 401) {
                toast.info(error.response.data.error);
            }
        } finally {
            setPreloader(false);
        }
    };
    useEffect(() => {
        getAdmins();
        document.title = "WorkCheck - Dashboard | Adminlar";
    }, []);

    return (
        <>
            {preloader && <Preloader />}
            <div>
                <h1 className='text-2xl font-bold'>Admins</h1>
                <div>
                    {admins.length > 0 &&
                        admins.map((admin) => (
                            <div key={admin.id}>
                                <div>{admin.username}</div>
                                <div>{admin.name}</div>
                                <div>{admin.phone}</div>
                                <div>{admin.role}</div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default DashboardAdmins;
