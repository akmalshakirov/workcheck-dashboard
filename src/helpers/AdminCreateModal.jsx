import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2Icon, UploadIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../components/ui/Modal/Modal";
import { Skeleton } from "../components/ui/Skeleton/Skeleton";
import { useAdmin } from "../hooks/useAdmin";
import PhoneInput from "./FormatPhone";

export const AdminCreateModal = ({
    createAdminModal,
    setCreateAdminModal,
    adminData,
    setAdminData,
    fileList,
    setFileList,
    showPassword,
    setShowPassword,
}) => {
    const { t } = useTranslation();
    const { branch } = useAdmin();
    const [createAdminLoading, setCreateAdminLoading] = useState(false);

    const createAdmin = async (e) => {
        e.preventDefault();
        setCreateAdminLoading(true);
        const formData = new FormData(e.target);

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
            if (response.status === 201) {
                getAdmins({
                    setPreloader,
                    setAdmins,
                    token,
                    lang,
                });
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
                        theme: theme == "true" ? "dark" : "light",
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                title: error.response.data.error,
                icon: "error",
                theme: theme == "true" ? "dark" : "light",
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
            setFileList(null);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (value) => {
        setAdminData((prev) => ({ ...prev, phone: value }));
    };

    return (
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
                                label: t("modal_admin_username") + ":",
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
                                    type={showPassword ? "text" : "password"}
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
                                        setShowPassword((curr) => !curr)
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
                                    <option disabled>Role tanlang...</option>
                                    <option value='ADMIN'>Admin</option>
                                    <option value='SUPERADMIN'>
                                        Super-admin
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className='flex-1'>
                            <div className='flex flex-col gap-1'>
                                <p className='mr-2'>Filialni tanlang:</p>
                                {branch === null ? (
                                    <Skeleton className='w-full h-10 rounded-lg' />
                                ) : (
                                    <select
                                        name='branchId'
                                        className='border w-full rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'>
                                        {branch?.length > 0 &&
                                            branch.map((b) => (
                                                <option value={b.id} key={b.id}>
                                                    {b.name}
                                                </option>
                                            ))}
                                    </select>
                                )}
                            </div>
                            <label className='cursor-pointer flex flex-col'>
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
                            {fileList?.length > 0 && fileList[0] && (
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
                                    whileTap={{ scale: 0.98 }}
                                    className='block border border-blue-500 bg-blue-300/10 p-4 rounded cursor-pointer'>
                                    <div className='flex'>
                                        <div className='max-w-1/4'>
                                            <img
                                                src={URL.createObjectURL(
                                                    fileList[0]
                                                )}
                                                alt='Admin Image'
                                                className='object-cover rounded-lg w-full h-full'
                                            />
                                        </div>
                                        <div>
                                            <p>
                                                Tanlagan rasmingiz shunaqa
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
                        {createAdminLoading ? (
                            <>
                                <Loader2Icon className='animate-spin' />{" "}
                                Yuklanmoqda...
                            </>
                        ) : (
                            t("ok")
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
