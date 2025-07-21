import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, UploadIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { baseURL } from "../../App";
import Modal from "../../components/ui/Modal/Modal";
import { Skeleton } from "../../components/ui/Skeleton/Skeleton";
import Table from "../../components/ui/Table/Table";
import { UploadImage } from "../../components/ui/UploadImage/UploadImage";
import PhoneInput from "../../helpers/FormatPhone";
import { getAdmins } from "../../service/api/api";

const MySwal = withReactContent(Swal);

const DashboardAdmins = () => {
    const token = localStorage.getItem("token");
    const [admins, setAdmins] = useState([]);
    const [preloader, setPreloader] = useState(false);
    const [createAdminModal, setCreateAdminModal] = useState(false);
    const [createAdminLoading, setCreateAdminLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [adminData, setAdminData] = useState({
        name: "",
        username: "",
        password: "",
        phone: "",
        role: "ADMIN",
    });
    const [id, setId] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [getAdminLoading, setGetAdminLoading] = useState(true);
    const [editLoading, setEditLoading] = useState(false);
    const [adminName, setAdminName] = useState("");
    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [adminPhone, setAdminPhone] = useState("");
    const [adminRole, setAdminRole] = useState("ADMIN");
    const lang = localStorage.getItem("lang");
    const [editingFileList, setEditingFileList] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (value) => {
        setAdminData((prev) => ({ ...prev, phone: value }));
    };

    const createAdmin = async (e) => {
        e.preventDefault();
        setCreateAdminLoading(true);
        const formData = new FormData(e.target);
        // formData.append("name", adminData.name);
        // formData.append("username", adminData.username);
        // formData.append("password", adminData.password);
        // formData.append("phone", adminData.phone);
        // formData.append("role", adminData.role);
        // formData.append("image", fileList[0]);

        try {
            const response = await axios.post(
                `${baseURL}/admin/create`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: lang,
                    },
                }
            );
            getAdmins();
            setAdminData({
                name: "",
                username: "",
                password: "",
                phone: "",
                role: "ADMIN",
            });
            setFileList(null);
            if (preloader == false) {
                Swal.fire({
                    title: response.data.message,
                    icon: "success",
                    confirmButtonText: t("ok2"),
                });
            }
        } catch (error) {
            Swal.fire({
                title: error.response.data.error,
                icon: "error",
            });
        } finally {
            setCreateAdminLoading(false);
            setCreateAdminModal(false);
            setAdminData({
                name: "",
                username: "",
                password: "",
                phone: "",
                role: "ADMIN",
            });
        }
    };

    useEffect(() => {
        getAdmins({
            setPreloader,
            setAdmins,
            token,
            lang,
        });
    }, []);

    useEffect(() => {
        document.title = `WorkCheck - Dashboard | ${
            t("sidebar_admins") || "Adminlar"
        }`;
    }, [t]);

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
            setAdminName(response.data.admin.name || "");
            setAdminUsername(response.data.admin.username || "");
            setAdminPassword("");
            setAdminPhone(response.data.admin.phone || "");
            setAdminRole(response.data.admin.role || "ADMIN");
            setEditingFileList(response.data.admin.image);
        } catch (error) {
            setGetAdminLoading(false);
            setIsEditModalOpen(false);
            Swal.fire({
                title: error.response.data.error,
                icon: "error",
                timer: 10000,
                timerProgressBar: true,
            });
        } finally {
            setGetAdminLoading(false);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", adminName || "");
            formData.append("username", adminUsername || "");
            formData.append("role", adminRole || "");
            formData.append("phone", adminPhone || "");
            editingFileList && formData.append("image", editingFileList);
            formData.append("password", adminPassword || "");
            const response = await axios.put(
                `${baseURL}/admin/${id}/update`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            Swal.fire({
                title: response.data.message,
                icon: "success",
                timer: 10000,
                timerProgressBar: true,
            });
            setEditingFileList(null);
            setAdminData({
                name: "",
                username: "",
                password: "",
                phone: "",
                role: "ADMIN",
            });
            setIsEditModalOpen(false);
            getAdmins();
        } catch (error) {
            Swal.fire({
                text: error?.response?.data?.error || "Xatolik yuz berdi",
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
            title: t("modal_admin_delete_title"),
            text: t("modal_admin_delete_desc"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: t("ok2"),
            cancelButtonText: t("cancel"),
            animation: true,
            theme: localStorage.getItem("isDark") == "true" ? "dark" : "light",
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

                MySwal.fire({
                    title: `${response.data.message}`,
                    text: `${response.data.message}`,
                    icon: "success",
                    theme:
                        localStorage.getItem("isDark") == "true"
                            ? "dark"
                            : "light",
                });
                getAdmins();
            } catch (error) {
                MySwal.fire({
                    title: error.response.data.error,
                    icon: "error",
                    theme:
                        localStorage.getItem("isDark") == "true"
                            ? "dark"
                            : "light",
                });
            }
        }
    };

    const renderInput = useCallback(
        ({
            id,
            name,
            label,
            type = "text",
            value,
            onChange,
            minLength = 3,
            maxLength = 15,
            required = true,
            placeholder = "",
            autoComplete = "off",
            ...rest
        }) => (
            <div className='flex flex-col gap-1'>
                <label htmlFor={id} className='text-base'>
                    {label}
                </label>
                <input
                    type={type}
                    id={id}
                    name={name}
                    className='border rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                    minLength={minLength}
                    maxLength={maxLength}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    {...rest}
                />
            </div>
        ),
        []
    );

    const handleFileChange = useCallback((e) => {
        setFileList(e?.target?.files ? Array.from(e.target.files) : []);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}>
            {preloader ? (
                <div className='flex flex-col gap-3'>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className='flex h-[6vh] gap-1 items-center'>
                            <Skeleton className='w-full h-full' />
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}>
                    <div className='flex items-center justify-between mb-5 '>
                        <h1 className='text-2xl font-bold'>
                            {t("sidebar_admins")}
                        </h1>
                        <button
                            className='border rounded-lg border-gray-500/70 p-1 px-2 bg-blue-600/80 hover:bg-blue-600 text-white active:scale-[0.95] duration-150 will-change-transform'
                            onClick={() => setCreateAdminModal(true)}>
                            {t("add_admin")}
                        </button>
                    </div>

                    <div>
                        {!admins || admins.length === 0 ? (
                            <h1>{t("no_admins_error")}</h1>
                        ) : (
                            <Table
                                data={admins}
                                deleteOnClick={handleDelete}
                                editOnClick={handleGetAdminById}
                            />
                        )}
                    </div>

                    {/* Create admin modal */}
                    <Modal visible={createAdminModal} title={t("add_admin")}>
                        <form onSubmit={createAdmin}>
                            <div>
                                <div className='flex gap-10'>
                                    <div className='w-1/2'>
                                        {renderInput({
                                            id: "admin-name",
                                            name: "name",
                                            label: t("modal_admin_name") + ":",
                                            value: adminData.name,
                                            onChange: handleChange,
                                            placeholder: "adminbek",
                                            autoComplete: "name",
                                        })}
                                        {renderInput({
                                            id: "admin-username",
                                            name: "username",
                                            label:
                                                t("modal_admin_username") + ":",
                                            value: adminData.username,
                                            onChange: handleChange,
                                            placeholder: "admin",
                                            autoComplete: "username",
                                        })}
                                        <div className='flex flex-col gap-1 relative'>
                                            <label
                                                htmlFor='admin-password'
                                                className='text-base'>
                                                Admin password:
                                            </label>
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                id='admin-password'
                                                name='password'
                                                className='border rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                                minLength={3}
                                                maxLength={15}
                                                value={adminData.password}
                                                onChange={handleChange}
                                                required
                                                placeholder='12345678'
                                                autoComplete='new-password'
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
                                                value={adminData.phone}
                                                onChange={handlePhoneChange}
                                                label='Admin telefon raqam:'
                                                name='phone'
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
                                                value={adminData.role}
                                                onChange={handleChange}
                                                id='admin-role'
                                                name='role'
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
                                    <div className='flex flex-col w-1/2 gap-1 '>
                                        <label
                                            htmlFor='image'
                                            className='cursor-pointer flex flex-col'>
                                            {fileList?.length === 0
                                                ? "Rasm tanlang:"
                                                : "Tanlangan rasm:"}
                                            {fileList?.length === 0 && (
                                                <motion.div
                                                    whileTap={{ scale: 0.98 }}
                                                    className='flex gap-2 px-2 py-5 border border-blue-500 bg-blue-400/20 rounded'>
                                                    Rasm tanlash uchun joy
                                                    <UploadIcon />
                                                </motion.div>
                                            )}
                                            <input
                                                hidden
                                                id='image'
                                                type='file'
                                                name='image'
                                                onChange={handleFileChange}
                                                autoComplete='off'
                                                multiple={false}
                                            />
                                        </label>
                                        {fileList?.length > 0 &&
                                            fileList[0] && (
                                                <motion.label
                                                    htmlFor='image'
                                                    initial={{
                                                        opacity: 0,
                                                        y: -50,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: -50,
                                                    }}
                                                    className='border border-blue-500 bg-blue-300/10 p-2 rounded cursor-pointer'>
                                                    <div className='flex gap-3'>
                                                        <img
                                                            src={URL.createObjectURL(
                                                                fileList[0]
                                                            )}
                                                            alt='Admin Image'
                                                            className='object-cover rounded-lg max-w-[50%] max-h-[50%]'
                                                        />
                                                        <div>
                                                            <p>
                                                                Tanlagan
                                                                rasmingiz
                                                                shunaqa
                                                                ko'rinadi:
                                                            </p>
                                                            <img
                                                                src={URL.createObjectURL(
                                                                    fileList[0]
                                                                )}
                                                                alt='Admin Image'
                                                                className='object-cover w-30 h-30 rounded-full p-2'
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.label>
                                            )}
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
                                    onClick={() => setCreateAdminModal(false)}
                                    type='button'
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

                    {/* Update admin modal */}
                    <Modal
                        title={t("modal_admin_update")}
                        visible={isEditModalOpen}>
                        <AnimatePresence>
                            <motion.div
                                layout
                                transition={{ duration: 0.4, type: "spring" }}>
                                {getAdminLoading ? (
                                    <div className='flex gap-2.5'>
                                        <div className='w-1/2'>
                                            {Array.from({ length: 5 }).map(
                                                (_, i) => (
                                                    <div
                                                        key={i}
                                                        className='p-2 flex gap-2 items-center'>
                                                        <Skeleton className='w-full h-14' />
                                                    </div>
                                                )
                                            )}
                                        </div>
                                        <div className='w-1/2 p-4'>
                                            <Skeleton className='w-40 h-40' />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <form onSubmit={handleEdit}>
                                            <div className='flex gap-10'>
                                                <div className='w-1/2'>
                                                    <div className='flex flex-col gap-1 mt-1'>
                                                        <label
                                                            htmlFor='edit-admin-name'
                                                            className='text-base'>
                                                            {t(
                                                                "modal_admin_name"
                                                            )}
                                                            :
                                                        </label>
                                                        <input
                                                            type='text'
                                                            id='edit-admin-name'
                                                            className='border rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                                            minLength={3}
                                                            maxLength={15}
                                                            name='name'
                                                            value={adminName}
                                                            onChange={(e) =>
                                                                setAdminName(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            required
                                                            autoComplete='name'
                                                        />
                                                    </div>
                                                    <div className='flex flex-col gap-1 mt-1'>
                                                        <label
                                                            htmlFor='edit-admin-username'
                                                            className='text-base'>
                                                            {t(
                                                                "modal_admin_username"
                                                            )}
                                                            :
                                                        </label>
                                                        <input
                                                            type='text'
                                                            id='edit-admin-username'
                                                            className='border rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                                            minLength={3}
                                                            maxLength={15}
                                                            value={
                                                                adminUsername
                                                            }
                                                            onChange={(e) =>
                                                                setAdminUsername(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            required
                                                            autoComplete='username'
                                                            name='username'
                                                        />
                                                    </div>
                                                    <div className='flex flex-col gap-1 mt-1'>
                                                        <PhoneInput
                                                            value={adminPhone}
                                                            onChange={
                                                                setAdminPhone
                                                            }
                                                            label={`${t(
                                                                "modal_admin_phone"
                                                            )}:`}
                                                            name='phone'
                                                            required
                                                        />
                                                    </div>
                                                    <div className='flex flex-col gap-1 mt-1'>
                                                        <label
                                                            htmlFor='edit-admin-role'
                                                            className='text-base'>
                                                            Admin role:
                                                        </label>
                                                        <select
                                                            multiple={false}
                                                            value={adminRole}
                                                            onChange={(e) =>
                                                                setAdminRole(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            id='edit-admin-role'
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
                                                    <div className='flex flex-col gap-1 mt-1'>
                                                        <label
                                                            htmlFor='edit-admin-password'
                                                            className='text-base'>
                                                            {t(
                                                                "modal_admin_password"
                                                            )}
                                                            :
                                                        </label>
                                                        <input
                                                            type='password'
                                                            id='edit-admin-password'
                                                            className='border rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                                            minLength={3}
                                                            maxLength={15}
                                                            name='password'
                                                            value={
                                                                adminPassword
                                                            }
                                                            onChange={(e) =>
                                                                setAdminPassword(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            autoComplete='current-password'
                                                        />
                                                    </div>
                                                </div>
                                                <div className='max-w-1/3'>
                                                    <UploadImage
                                                        label='Adminni rasmi:'
                                                        fileList={
                                                            editingFileList
                                                        }
                                                        className=''
                                                        onChange={(e) => {
                                                            setEditingFileList(
                                                                e
                                                            );
                                                        }}
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
                                                        setIsEditModalOpen(
                                                            false
                                                        )
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
                            </motion.div>
                        </AnimatePresence>
                    </Modal>
                </motion.div>
            )}
        </motion.div>
    );
};

export default DashboardAdmins;
