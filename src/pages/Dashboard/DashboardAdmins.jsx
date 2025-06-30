import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { baseURL } from "../../App";
import Preloader from "../../components/ui/Preloader/Preloader";
import Table from "../../components/ui/Table/Table";
import Img from "/public/favicon.png";
import { t } from "i18next";

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
            toast.info(error.response.data.error);
            if (error.code === "ERR_NETWORK") {
                toast.info("Internet aloqasi yo'q");
            } else if (error.response.status === 401) {
                const refreshResponse = await axios.post(
                    `${baseURL}/refresh`,
                    {},
                    {
                        withCredentials: true,
                    }
                );

                if (refreshResponse.status === 200) {
                    localStorage.setItem("token", refreshResponse.data.token);
                    const token = localStorage.getItem("token");
                    const response = await axios.get(`${baseURL}/admins`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.status === 200) {
                        toast.success(response.data.message);
                        setAdmins(response?.data?.admins);
                        localStorage.setItem("token", response.data.token);
                    }
                }
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
                <h1 className='text-2xl font-bold'>{t("sidebar_admins")}</h1>
                <div className='mt-3'>
                    <Table data={admins} />
                </div>
            </div>
        </>
    );
};

export default DashboardAdmins;
