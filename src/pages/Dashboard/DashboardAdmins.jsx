import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { baseURL } from "../../App";
import Modal from "../../components/ui/Modal/Modal";
import Preloader from "../../components/ui/Preloader/Preloader";
import Table from "../../components/ui/Table/Table";

const DashboardAdmins = () => {
    const token = localStorage.getItem("token");
    const [admins, setAdmins] = useState([]);
    const [preloader, setPreloader] = useState(false);
    const [addAdminModal, setAddAdminModal] = useState(false);
    const [createAdminLoading, setCreateAdminLoading] = useState(false);
    const { t } = useTranslation();

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
                        setAdmins(response?.data?.admins);
                    }
                }
            }
        } finally {
            setPreloader(false);
        }
    };

    const createAdmin = async () => {
        setCreateAdminLoading(true);
        try {
            const response = await axios.post(
                `${baseURL}/admin/create`,
                {
                    username: "AJJI",
                    name: "sujji",
                    phone: "+998997772122",
                    image: "https://www.foodbusinessnews.net/ext/resources/2024/11/04/WOLFF.jpg?height=667&t=1730727348&width=1080",
                    password: "ajjibek1",
                    role: "ADMIN",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.error);
            console.log(error);
        } finally {
            setCreateAdminLoading(false);
        }
    };

    useEffect(() => {
        getAdmins();
        document.title = "WorkCheck - Dashboard | Adminlar";
    }, []);

    return (
        <>
            {preloader && <Preloader />}
            {!preloader && (
                <div>
                    <div className='flex items-center justify-between mb-5'>
                        <h1 className='text-2xl font-bold'>
                            {t("sidebar_admins")}
                        </h1>
                        <button
                            className='border rounded-lg p-1 px-2'
                            onClick={() => setAddAdminModal(true)}>
                            {t("add_admin")}
                        </button>
                    </div>
                    <Modal
                        title={t("add_admin")}
                        visible={addAdminModal}
                        onCancel={() => setAddAdminModal(false)}
                        onOk={() => createAdmin()}
                        Disable={createAdminLoading}>
                        {createAdminLoading ? (
                            <div>Yuklanmoqda</div>
                        ) : (
                            <form onSubmit={createAdmin}>
                                <label
                                    htmlFor='admin-name'
                                    className='text-base'>
                                    Admin nomi:{" "}
                                </label>
                                <input
                                    type='text'
                                    id='admin-name'
                                    className='border rounded-lg px-1 py-2 outline-none focus:border-blue-400 duration-150'
                                    required
                                    minLength={3}
                                    maxLength={15}
                                />
                            </form>
                        )}
                    </Modal>
                    <div className=''>
                        {admins.length == 0 ||
                        admins == null ||
                        admins == undefined ? (
                            <>
                                <h1>{t("no_admins_error")}</h1>
                            </>
                        ) : (
                            <Table data={admins} />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default DashboardAdmins;
