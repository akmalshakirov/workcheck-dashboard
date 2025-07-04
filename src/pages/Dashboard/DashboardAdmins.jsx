import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { baseURL } from "../../App";
import Modal from "../../components/ui/Modal/Modal";
import Preloader from "../../components/ui/Preloader/Preloader";
import Table from "../../components/ui/Table/Table";
// import FileUpload from "../../components/ui/UploadImage/UploadImage";

const DashboardAdmins = () => {
    const token = localStorage.getItem("token");
    const [admins, setAdmins] = useState([]);
    const [preloader, setPreloader] = useState(false);
    const [addAdminModal, setAddAdminModal] = useState(false);
    const [createAdminLoading, setCreateAdminLoading] = useState(false);
    const [adminName, setAdminName] = useState("");
    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [adminPhone, setAdminPhone] = useState("");
    const [adminRole, setAdminRole] = useState("");
    const [adminImage, setAdminImage] = useState(null);
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

        const formData = new FormData();
        formData.append("name", adminName);
        formData.append("username", adminUsername);
        formData.append("password", adminPassword);
        formData.append("image", adminImage);
        formData.append("phone", String(adminPhone));
        formData.append("role", adminRole);

        try {
            const response = await axios.post(
                `${baseURL}/admin/create`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.status === 201) {
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
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
                            className='border rounded-lg border-gray-500/70 p-1 px-2 bg-blue-800 text-white'
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
                            <div className='w-full h-full'>Yuklanmoqda...</div>
                        ) : (
                            <form
                                onSubmit={createAdmin}
                                className='flex gap-10 px-2 w-full'>
                                <div className='flex flex-col w-full'>
                                    <div className='flex flex-col gap-1'>
                                        <label
                                            htmlFor='admin-name'
                                            className='text-base'>
                                            {t("modal_admin_name")}:
                                        </label>
                                        <input
                                            type='text'
                                            id='admin-name'
                                            className='border rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                            minLength={3}
                                            maxLength={15}
                                            value={adminName}
                                            onChange={(e) =>
                                                setAdminName(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label
                                            htmlFor='admin-username'
                                            className='text-base'>
                                            {t("modal_admin_username")}:
                                        </label>
                                        <input
                                            type='text'
                                            id='admin-username'
                                            className='border rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                            minLength={3}
                                            maxLength={15}
                                            value={adminUsername}
                                            onChange={(e) =>
                                                setAdminUsername(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label
                                            htmlFor='admin-password'
                                            className='text-base'>
                                            Admin password:{" "}
                                        </label>
                                        <input
                                            type='password'
                                            id='admin-password'
                                            className='border rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                            minLength={3}
                                            maxLength={15}
                                            value={adminPassword}
                                            onChange={(e) =>
                                                setAdminPassword(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label
                                            htmlFor='admin-phone'
                                            className='text-base'>
                                            Admin telefon raqam:{" "}
                                        </label>
                                        <input
                                            type='number'
                                            id='admin-phone'
                                            className='border rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                            max={9}
                                            maxLength={9}
                                            value={adminPhone}
                                            onChange={(e) =>
                                                setAdminPhone(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label
                                            htmlFor='admin-role'
                                            className='text-base'>
                                            Admin role:
                                        </label>
                                        <select
                                            multiple={false}
                                            value={adminRole}
                                            onChange={(e) =>
                                                setAdminRole(e.target.value)
                                            }
                                            id='admin-role'
                                            className='border rounded-lg border-gray-500/70 px-3 py-2 text-base outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                            required>
                                            <option disabled>
                                                Role tanlang...
                                            </option>
                                            <option value='ADMIN'>Admin</option>
                                            <option value='SUPERADMIN'>
                                                Super-admin
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className='flex flex-col w-full gap-1'>
                                    <span>Rasm tanlang:</span>
                                    <input
                                        className='border rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                        type='file'
                                        accept='image/*'
                                        id='admin-image'
                                        required
                                        minLength={3}
                                        maxLength={15}
                                        onChange={(e) =>
                                            setAdminImage(e.target.files[0])
                                        }
                                    />
                                    {/* <FileUpload /> */}
                                </div>
                            </form>
                        )}
                    </Modal>
                    <div>
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
