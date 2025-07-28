import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { Modal } from "../components/ui/Modal/Modal";
import { Skeleton } from "../components/ui/Skeleton/Skeleton";
import PhoneInput from "./FormatPhone";
import { useAdmin } from "../hooks/useAdmin";
import { getAdmins } from "../service/api/api";

export const AdminEditModal = ({ showPassword, setShowPassword }) => {
    const theme = localStorage.getItem("isDark");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [getAdminLoading, setGetAdminLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const { branch, setAdmin } = useAdmin();
    const { t } = useTranslation();
    const [adminData, setAdminData] = useState({
        adminName: "",
        adminUsername: "",
        adminPassword: "",
        adminPhone: "",
        adminBranch: "",
        adminRole: "ADMIN",
        adminImage: null,
        branchData: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminData((prev) => ({ ...prev, [name]: value }));
    };

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
            // setAdminName(response.data.admin.name || "");
            // setAdminUsername(response.data.admin.username || "");
            // setAdminPassword("");
            // setAdminPhone(response.data.admin.phone || "");
            // setAdminRole(response.data.admin.role || "ADMIN");
            // setEditingFileList(response.data.admin.image);
            setAdmin(response.data.admin);
            setBranchData(response.data.admin.branch);
        } catch (error) {
            setGetAdminLoading(false);
            setIsEditModalOpen(false);
            Swal.fire({
                title: error.response.data.error,
                icon: "error",
                timer: 10000,
                timerProgressBar: true,
                theme: theme == "true" ? "dark" : "light",
            });
        } finally {
            setGetAdminLoading(false);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        try {
            const formData = new FormData(e.target);
            const response = await axios.put(
                `${baseURL}/admin/${id}/update`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                Swal.fire({
                    title: response.data.message,
                    icon: "success",
                    timer: 10000,
                    timerProgressBar: true,
                    theme: theme == "true" ? "dark" : "light",
                });
                setAdminData({
                    name: "",
                    username: "",
                    password: "",
                    phone: "",
                    role: "ADMIN",
                });
                setIsEditModalOpen(false);
                getAdmins({
                    setPreloader,
                    setAdmins,
                    token,
                    lang,
                });
            }
        } catch (error) {
            Swal.fire({
                text: error?.response?.data?.error,
                icon: "error",
                timerProgressBar: true,
                timer: 10000,
                theme: theme == "true" ? "dark" : "light",
            });
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <Modal title={t("modal_admin_update")} visible={isEditModalOpen}>
            <AnimatePresence>
                <motion.div
                    layout
                    transition={{ duration: 0.4, type: "spring" }}>
                    {getAdminLoading ? (
                        <div className='flex gap-2.5'>
                            <div className='w-1/2'>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className='p-2 flex gap-2 items-center'>
                                        <Skeleton className='w-full h-14' />
                                    </div>
                                ))}
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
                                                {t("modal_admin_name")}:
                                            </label>
                                            <input
                                                type='text'
                                                id='edit-admin-name'
                                                className='border rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                                minLength={3}
                                                maxLength={15}
                                                name='name'
                                                value={adminData.adminName}
                                                onChange={handleChange}
                                                required
                                                autoComplete='name'
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1 mt-1'>
                                            <label
                                                htmlFor='edit-admin-username'
                                                className='text-base'>
                                                {t("modal_admin_username")}:
                                            </label>
                                            <input
                                                type='text'
                                                id='edit-admin-username'
                                                className='border rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                                minLength={3}
                                                maxLength={15}
                                                value={adminData.adminUsername}
                                                onChange={handleChange}
                                                required
                                                autoComplete='username'
                                                name='username'
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1 mt-1'>
                                            <PhoneInput
                                                value={adminData.adminPhone}
                                                onChange={handleChange}
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
                                                value={adminData.adminRole}
                                                onChange={handleChange}
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
                                        <div className='flex flex-col gap-1 mt-1 relative'>
                                            <label
                                                htmlFor='edit-admin-password'
                                                className='text-base'>
                                                {t("modal_admin_password")}:
                                            </label>
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                id='edit-admin-password'
                                                className='border rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                                minLength={3}
                                                maxLength={15}
                                                name='password'
                                                value={adminData.adminPassword}
                                                onChange={handleChange}
                                                autoComplete='current-password'
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
                                    </div>
                                    <div className='flex-1'>
                                        <div className='flex flex-col gap-1'>
                                            <p className='mr-2'>
                                                Filialni tanlang:
                                            </p>
                                            {branch === null ? (
                                                <Skeleton className='w-full h-10 rounded-lg' />
                                            ) : (
                                                <select
                                                    name='branchId'
                                                    className='border w-full rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                                    value={branch.name}>
                                                    {branch?.length > 0 &&
                                                        branch.map((b) => (
                                                            <option
                                                                value={b.id}
                                                                key={b.id}>
                                                                {b.name}
                                                            </option>
                                                        ))}
                                                </select>
                                            )}
                                        </div>
                                        <input
                                            hidden
                                            id='image'
                                            type='file'
                                            name='image'
                                            onChange={handleChange}
                                            autoComplete='off'
                                            multiple={false}
                                        />
                                        {adminData.adminImage && (
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
                                                className='block border border-blue-500 bg-blue-300/10 p-4 rounded cursor-pointer mt-4'>
                                                <div className='flex gap-4'>
                                                    <div className='flex-1'>
                                                        <img
                                                            src={
                                                                editingFileList
                                                            }
                                                            alt='Admin Image'
                                                            className='object-cover rounded-lg w-full h-full'
                                                        />
                                                    </div>
                                                    <div>
                                                        <p>
                                                            Tanlangan rasm
                                                            shunaqa ko'rinadi:
                                                        </p>
                                                        <img
                                                            src={
                                                                editingFileList
                                                            }
                                                            alt='Admin Image'
                                                            className='object-cover w-30 h-30 rounded-full p-2'
                                                        />
                                                    </div>
                                                </div>
                                            </motion.label>
                                        )}
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
                </motion.div>
            </AnimatePresence>
        </Modal>
    );
};
