import { motion } from "framer-motion";
import { Camera, Edit3, Eye, EyeOff, Save, User, XIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../../components/ui/Skeleton/Skeleton";
import { useAdmin } from "../../hooks/useAdmin";
import { useApi } from "../../service/api/api";
import { Button } from "../../components/ui/Button/Button";
import PhoneInput from "../../helpers/FormatPhone";

const DashboardProfile = () => {
    const { admin, setAdmin, loading } = useAdmin();
    const { updateProfile } = useApi();
    const { t } = useTranslation();

    const [adminData, setAdminData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [fileList, setFileList] = useState(null);

    useEffect(() => {
        if (admin) {
            setAdminData({
                name: admin.name || "",
                username: admin.username || "",
                password: admin.password || "",
                phone: admin.phone || "",
            });
            setFileList(admin.image);
        }
    }, [admin]);

    useEffect(() => {
        document.title = `WorkCheck - Dashboard | ${t("sidebar_profile")}`;
    }, [t]);

    const imageUrl = useMemo(() => {
        if (!fileList) return null;
        return fileList instanceof Blob
            ? URL.createObjectURL(fileList)
            : fileList;
    }, [fileList]);

    useEffect(() => {
        return () => {
            if (fileList instanceof Blob && imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [fileList, imageUrl]);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileList(file);
        }
    }, []);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setAdminData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const toggleEdit = useCallback(() => {
        setIsEditing((prev) => !prev);
        if (isEditing && admin) {
            setAdminData({
                name: admin.name || "",
                username: admin.username || "",
                password: admin.password || "",
                phone: admin.phone || "",
            });
            setFileList(admin.image);
        }
    }, [isEditing, admin]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            if (!adminData.name || !adminData.username) return;

            const formData = {
                ...adminData,
                ...(fileList !== admin?.image && { image: fileList }),
            };

            await updateProfile({
                profileData: formData,
                setIsSubmitting,
                setIsEditing,
                setAdmin,
            });
        },
        [adminData, fileList, admin?.image, updateProfile, setAdmin]
    );

    const isFormDisabled = !isEditing || isSubmitting;

    return (
        <div className='container mx-auto'>
            <header className='text-center mb-10'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                    {t("sidebar_profile")}
                </h1>
            </header>

            <div className='max-w-6xl mx-auto'>
                <div className='grid lg:grid-cols-3 gap-8'>
                    <aside className='lg:col-span-1'>
                        <div className='rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8'>
                            <div className='text-center'>
                                <div className='relative inline-block mb-6'>
                                    {loading || !imageUrl ? (
                                        <Skeleton className='size-32 rounded-full' />
                                    ) : (
                                        <div className='relative group'>
                                            <img
                                                src={imageUrl}
                                                alt={
                                                    adminData.name || "Profile"
                                                }
                                                className='size-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600 shadow-md transition-all duration-200 group-hover:scale-105'
                                                draggable={false}
                                                loading='lazy'
                                            />
                                        </div>
                                    )}

                                    {isEditing && (
                                        <label
                                            htmlFor='image'
                                            className='absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 cursor-pointer shadow-md border-2 border-white dark:border-gray-700 flex items-center justify-center duration-75 active:scale-90 will-change-transform'
                                            aria-label={t(
                                                "change_profile_image"
                                            )}>
                                            <Camera size={16} />
                                            <input
                                                type='file'
                                                name='image'
                                                id='image'
                                                accept='image/*'
                                                onChange={handleImageChange}
                                                hidden
                                                aria-label={t(
                                                    "upload_profile_image"
                                                )}
                                            />
                                        </label>
                                    )}
                                </div>

                                <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-2'>
                                    {adminData.name || admin?.name || "Admin"}
                                </h2>
                                <span className='inline-block p-2 text-sm leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-200 text-green-800 dark:text-green-900 mb-4'>
                                    {admin?.role || "Administrator"}
                                </span>
                            </div>

                            <div className='mt-8'>
                                <div className='bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-600'>
                                    <div className='flex items-center gap-4'>
                                        <div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center'>
                                            <User
                                                size={20}
                                                className='text-white'
                                            />
                                        </div>
                                        <div>
                                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                                Role
                                            </p>
                                            <p className='font-medium text-gray-900 dark:text-white'>
                                                {admin?.role || "Administrator"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className='lg:col-span-2'>
                        <motion.div
                            layout
                            transition={{ duration: 0.1 }}
                            className='rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8'>
                            <div className='flex items-center justify-between mb-8'>
                                <h3 className='text-2xl font-semibold text-gray-900 dark:text-white'>
                                    {t("edit_profile")}
                                </h3>
                                <Button
                                    type='button'
                                    onClick={toggleEdit}
                                    loading={isSubmitting || loading}
                                    variant={isEditing ? "danger" : "primary"}>
                                    {isEditing ? (
                                        <div className='flex items-center gap-2'>
                                            <XIcon size={16} />
                                            {t("cancel")}
                                        </div>
                                    ) : (
                                        <div className='flex items-center gap-2'>
                                            <Edit3 size={16} />
                                            {t("edit")}
                                        </div>
                                    )}
                                </Button>
                            </div>

                            <form onSubmit={handleSubmit} className='space-y-6'>
                                <div className='grid md:grid-cols-2 gap-6'>
                                    <div>
                                        <label
                                            className='block text-base font-medium text-gray-700 dark:text-gray-300 mb-2'
                                            htmlFor='admin-name'>
                                            {t("modal_admin_name")}
                                        </label>
                                        <input
                                            id='admin-name'
                                            type='text'
                                            name='name'
                                            value={adminData.name ?? ""}
                                            onChange={handleInputChange}
                                            disabled={isFormDisabled}
                                            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 duration-200 disabled:opacity-50 disabled:cursor-not-allowed outline-none'
                                            required
                                            autoComplete='name'
                                            aria-required='true'
                                        />
                                    </div>

                                    <div>
                                        <label
                                            className='block text-base font-medium text-gray-700 dark:text-gray-300 mb-2'
                                            htmlFor='admin-username'>
                                            {t("modal_admin_username")}
                                        </label>
                                        <input
                                            id='admin-username'
                                            type='text'
                                            name='username'
                                            value={adminData.username ?? ""}
                                            onChange={handleInputChange}
                                            disabled={isFormDisabled}
                                            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 duration-200 disabled:opacity-50 disabled:cursor-not-allowed outline-none'
                                            required
                                            autoComplete='username'
                                            aria-required='true'
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        className='block text-base font-medium text-gray-700 dark:text-gray-300 mb-2'
                                        htmlFor='admin-password'>
                                        {t("modal_admin_password")}
                                    </label>
                                    <div className='relative'>
                                        <input
                                            id='admin-password'
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name='password'
                                            value={adminData.password ?? ""}
                                            onChange={handleInputChange}
                                            disabled={isFormDisabled}
                                            className='w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed outline-none'
                                            minLength={6}
                                            autoComplete='current-password'
                                        />
                                        <button
                                            type='button'
                                            onClick={togglePasswordVisibility}
                                            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                                            aria-label={
                                                showPassword
                                                    ? t("hide_password")
                                                    : t("show_password")
                                            }>
                                            {showPassword ? (
                                                <EyeOff size={20} />
                                            ) : (
                                                <Eye size={20} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className='grid md:grid-cols-2 gap-6'>
                                    <div>
                                        <label
                                            htmlFor='phone'
                                            className='block text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                            {t("modal_admin_phone")}
                                        </label>
                                        <PhoneInput
                                            disabled={isFormDisabled}
                                            name='phone'
                                            required
                                            value={adminData.phone ?? ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div
                                        className={`flex duration-75 ${
                                            isEditing
                                                ? "scale-100 pointer-events-auto opacity-100"
                                                : "scale-95 pointer-events-none opacity-0"
                                        }`}>
                                        <Button
                                            type='submit'
                                            loading={
                                                isSubmitting ||
                                                !adminData.name ||
                                                !adminData.username
                                            }
                                            fullWidth
                                            className='mt-auto h-[62%]'>
                                            {isSubmitting ? (
                                                <div className='flex items-center gap-2'>
                                                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                                    <span>{t("saving")}</span>
                                                </div>
                                            ) : (
                                                <div className='flex items-center gap-2'>
                                                    <Save size={20} />
                                                    <span>{t("save")}</span>
                                                </div>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DashboardProfile;
