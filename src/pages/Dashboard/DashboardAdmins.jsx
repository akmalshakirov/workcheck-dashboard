import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { baseURL } from "../../App";
import Modal from "../../components/ui/Modal/Modal";
import Preloader from "../../components/ui/Preloader/Preloader";
import Table from "../../components/ui/Table/Table";
import UploadImage from "../../components/ui/UploadImage/UploadImage";
import PhoneInput from "../../helpers/FormatPhone";

const MySwal = withReactContent(Swal);

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
    const [adminRole, setAdminRole] = useState("ADMIN");
    const [imageData, setImageData] = useState({
        binary: null,
        fileName: "",
        preview: null,
    });
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [getAdminLoading, setGetAdminLoading] = useState(true);

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
            } else if (error?.response?.status === 401) {
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

    const getFileType = (fileName) => {
        const extension = fileName.split(".").pop().toLowerCase();
        const mimeTypes = {
            jpg: "image/jpg",
            jpeg: "image/jpeg",
            png: "image/png",
            webp: "image/webp",
            svg: "image/svg",
        };
        return mimeTypes[extension] || "image/jpeg";
    };

    const createAdmin = async (e) => {
        e.preventDefault();
        setCreateAdminLoading(true);

        const imageFile = new File([imageData.binary], imageData.fileName, {
            type: getFileType(imageData.fileName),
        });

        const formData = new FormData();
        formData.append("name", adminName);
        formData.append("username", adminUsername);
        formData.append("password", adminPassword);
        formData.append("image", imageFile);
        formData.append("phone", adminPhone);
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
                Swal.fire({
                    title: response.data.message,
                    icon: "success",
                    confirmButtonText: "Ok",
                });
                setAddAdminModal(false);
                getAdmins();
                setAdminUsername("");
                setAdminName("");
                setAdminPassword("");
                setAdminPhone("");
                setAdminRole("ADMIN");
            }
        } catch (error) {
            toast.error(error.response.data.error);
        } finally {
            setCreateAdminLoading(false);
        }
    };

    const handleImageSelect = (binary, fileName) => {
        setImageData({
            binary,
            fileName,
            preview: URL.createObjectURL(new Blob([binary])),
        });
        console.log("Rasm tanlandi:", fileName);
    };

    useEffect(() => {
        getAdmins();
        document.title = "WorkCheck - Dashboard | Adminlar";
    }, []);

    const handleGetAdminById = async (id) => {
        setIsEditModalOpen(true);
        setGetAdminLoading(true);
        setId(id);
        try {
            const response = await axios.get(`${baseURL}/admin/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(response.data.message);
            setAdmin(response.data.admin);
        } catch (error) {
            console.log(error);
        } finally {
            setGetAdminLoading(false);
        }
    };

    const handleEdit = async (id) => {
        setEditLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", adminName ? adminName : admin.name);
            formData.append(
                "username",
                adminUsername ? adminUsername : admin.username
            );
            formData.append("role", adminRole ? adminRole : admin.role);
            formData.append("phone", adminPhone ? adminPhone : admin.phone);
            console.log(formData);
            const response = await axios.put(
                `${baseURL}/admin/${id}/update`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) toast.success(response.data.message);
        } catch (error) {
            Swal.fire({
                text: error?.response?.data?.error,
                icon: "error",
                timerProgressBar: true,
                timer: 10000,
            });
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await MySwal.fire({
            title: "Bu adminni o'chirmoqchimisiz?",
            text: "Bu amalni ortga qaytarib bo'lmaydi!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ha!",
            cancelButtonText: t("cancel"),
            animation: true,
            theme: localStorage.getItem("isDark") == true,
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(
                    `${baseURL}/admin/${id}/delete`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.status === 200) {
                    MySwal.fire(
                        `${response.data.message}`,
                        `${response.data.message}`,
                        "success"
                    );
                }
            } catch (error) {
                MySwal.fire(
                    "Error!",
                    "There was a problem deleting your item.",
                    "error"
                );
            }
        }
    };

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
                            className='border rounded-lg border-gray-500/70 p-1 px-2 bg-blue-800 text-white active:scale-[0.95] duration-150 will-change-transform'
                            onClick={() => setAddAdminModal(true)}>
                            {t("add_admin")}
                        </button>
                    </div>

                    {/* Create admin modal */}
                    <Modal visible={addAdminModal} title={t("add_admin")}>
                        <form onSubmit={createAdmin}>
                            <div>
                                <div className='flex gap-10'>
                                    <div className='max-w-1/2 w-full'>
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
                                                placeholder='adminbek'
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
                                                    setAdminUsername(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                placeholder='admin'
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1 relative'>
                                            <label
                                                htmlFor='admin-password'
                                                className='text-base'>
                                                Admin password:{" "}
                                            </label>
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                id='admin-password'
                                                className='border rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                                minLength={3}
                                                maxLength={15}
                                                value={adminPassword}
                                                onChange={(e) =>
                                                    setAdminPassword(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                placeholder='12345678'
                                            />
                                            <button
                                                name='Show password button'
                                                aria-label='Show password button'
                                                title='Show password'
                                                type='button'
                                                onClick={() =>
                                                    setShowPassword(
                                                        (curr) => !curr
                                                    )
                                                }
                                                className='absolute top-9.5 ml-2 right-3 text-gray-500 hover:text-gray-700'
                                                tabIndex={-1}
                                                disabled={createAdminLoading}>
                                                {showPassword ? (
                                                    <EyeOff size={20} />
                                                ) : (
                                                    <Eye size={20} />
                                                )}
                                            </button>
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <PhoneInput
                                                value={adminPhone}
                                                onChange={(e) =>
                                                    setAdminPhone(e)
                                                }
                                                label='Admin telefon raqam:'
                                                name='Admin telefon raqam'
                                                required
                                            />
                                            {/* <label
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
                                                    setAdminPhone(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            /> */}
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
                                                onChange={(e) => {
                                                    setAdminRole(
                                                        e.target.value
                                                    );
                                                }}
                                                id='admin-role'
                                                className='border rounded-lg border-gray-500/70 px-3 py-2 text-base outline-none focus:border-blue-400 duration-150 dark:border-gray-600 dark:bg-[#0f0f0f]'
                                                required>
                                                <option disabled>
                                                    Role tanlang...
                                                </option>
                                                <option value='ADMIN'>
                                                    Admin
                                                </option>
                                                <option value='SUPERADMIN'>
                                                    Super-admin
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='flex flex-col w-1/2 gap-1'>
                                        <span>Rasm tanlang:</span>
                                        {/* <input
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
                                        /> */}
                                        {/* <UploadImage
                                            onFileBinary={
                                                (e) => setAdminImage(e)
                                            }
                                        /> */}
                                        <UploadImage
                                            onFileBinary={handleImageSelect}
                                            maxFileSize={5 * 1024 * 1024}
                                            acceptedTypes={[
                                                "image/jpeg",
                                                "image/png",
                                                "image/webp",
                                            ]}
                                            className='w-full'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-end gap-3 mt-4'>
                                <button
                                    className={`py-2 px-2.5 rounded-lg border-none cursor-pointer bg-red-600/80 hover:bg-red-600 duration-150 text-white w-max active:scale-[0.95] will-change-transform ${
                                        createAdminLoading
                                            ? "opacity-30 pointer-events-none"
                                            : ""
                                    }`}
                                    onClick={() => setAddAdminModal(false)}
                                    disabled={createAdminLoading}>
                                    {t("cancel")}
                                </button>
                                <button
                                    className={`py-2 px-2.5 rounded-lg text-white border-none cursor-pointer bg-[#126ac9] duration-150 hover:bg-[#007bff] w-max active:scale-[0.95] will-change-transform ${
                                        createAdminLoading
                                            ? "opacity-30 pointer-events-none"
                                            : ""
                                    }`}
                                    type='submit'
                                    disabled={createAdminLoading}>
                                    {t("ok")}
                                </button>
                            </div>
                        </form>
                    </Modal>

                    {/* Update modal */}
                    <Modal title='Adminni tahrirlash' visible={isEditModalOpen}>
                        {getAdminLoading ? (
                            <div className='w-[900px] h-[400px]'>
                                <h1 className='text-2xl'>
                                    {t("preloader")}...{" "}
                                </h1>
                            </div>
                        ) : (
                            <>
                                <form onSubmit={handleEdit}>
                                    <div className='flex gap-10'>
                                        <div className='max-w-1/2 w-full'>
                                            <div className='flex flex-col gap-1'>
                                                <label
                                                    htmlFor='admin-name'
                                                    className='text-base'>
                                                    {t("modal_admin_name")}:
                                                </label>
                                                <input
                                                    type='text'
                                                    id='admin-name'
                                                    className='border rounded-lg border-gray-500/70 px-3 py-2 text-`[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                                    minLength={3}
                                                    maxLength={15}
                                                    defaultValue={admin.name}
                                                    onChange={(e) =>
                                                        setAdminName(
                                                            e.target.value
                                                        )
                                                    }
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
                                                    defaultValue={
                                                        admin.username
                                                    }
                                                    onChange={(e) =>
                                                        setAdminUsername(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className='flex flex-col gap-1 relative'>
                                                <label
                                                    htmlFor='admin-password'
                                                    className='text-base'>
                                                    Admin password:{" "}
                                                </label>
                                                <input
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    id='admin-password'
                                                    className='border rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                                    minLength={3}
                                                    maxLength={15}
                                                    defaultValue={""}
                                                    onChange={(e) =>
                                                        setAdminPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <button
                                                    name='Show password button'
                                                    aria-label='Show password button'
                                                    title='Show password'
                                                    type='button'
                                                    onClick={() =>
                                                        setShowPassword(
                                                            (curr) => !curr
                                                        )
                                                    }
                                                    className='absolute top-9.5 ml-2 right-3 text-gray-500 hover:text-gray-700'
                                                    tabIndex={-1}
                                                    disabled={editLoading}>
                                                    {showPassword ? (
                                                        <EyeOff size={20} />
                                                    ) : (
                                                        <Eye size={20} />
                                                    )}
                                                </button>
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <PhoneInput
                                                    value={admin.phone}
                                                    onChange={(e) =>
                                                        setAdminPhone(e)
                                                    }
                                                    label='Admin telefon raqam:'
                                                    name='Admin telefon raqam'
                                                    placeholder={admin?.phone}
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
                                                    defaultValue={admin.role}
                                                    onChange={(e) => {
                                                        setAdminRole(
                                                            e.target.value
                                                        );
                                                    }}
                                                    id='admin-role'
                                                    className='border rounded-lg border-gray-500/70 px-3 py-2 text-base outline-none focus:border-blue-400 duration-150 dark:border-gray-600'>
                                                    <option disabled>
                                                        Role tanlang...
                                                    </option>
                                                    <option value='ADMIN'>
                                                        Admin
                                                    </option>
                                                    <option value='SUPERADMIN'>
                                                        Super-admin
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className='flex flex-col w-1/2 gap-1'>
                                            <span>Rasm tanlang:</span>
                                            <UploadImage
                                                onFileBinary={(e) =>
                                                    console.log(e)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className='flex justify-end gap-3 mt-4'>
                                        <button
                                            type='button'
                                            className={`py-2 px-2.5 rounded-lg border-none cursor-pointer bg-red-600/80 hover:bg-red-600 duration-150 text-white w-max active:scale-[0.95] will-change-transform ${
                                                editLoading
                                                    ? "opacity-30 pointer-events-none"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setIsEditModalOpen(false)
                                            }
                                            disabled={editLoading}>
                                            {t("cancel")}
                                        </button>
                                        <button
                                            className={`py-2 px-2.5 rounded-lg text-white border-none cursor-pointer bg-[#126ac9] duration-150 hover:bg-[#007bff] w-max active:scale-[0.95] will-change-transform ${
                                                editLoading
                                                    ? "opacity-30 pointer-events-none"
                                                    : ""
                                            }`}
                                            type='submit'
                                            disabled={editLoading}>
                                            {t("ok")}
                                        </button>
                                    </div>
                                </form>
                            </>
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
                            <Table
                                data={admins}
                                deleteOnClick={handleDelete}
                                editOnClick={handleEdit}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default DashboardAdmins;
