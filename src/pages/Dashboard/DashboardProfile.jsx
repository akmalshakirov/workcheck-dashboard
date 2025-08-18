import { motion } from "framer-motion";
import { Camera, Edit3, Eye, EyeOff, Save, User, XIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../../components/ui/Skeleton/Skeleton";
import { useAdmin } from "../../hooks/useAdmin";
import { useApi } from "../../service/api/api";

const DashboardProfile = () => {
    const token = localStorage.getItem("token");
    const { admin, setAdmin, loading } = useAdmin();
    const { updateProfile } = useApi();
    const { t } = useTranslation();
    const [adminData, setAdminData] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [fileList, setFileList] = useState(admin?.image);
    console.log("x", admin?.image, "x");

    useEffect(() => {
        document.title = `WorkCheck - Dashboard | ${t("sidebar_profile")}`;
    }, [t]);

    useEffect(() => {
        setAdmin(admin);
        setFileList(admin?.image);
    }, [admin]);

    const handleImageChange = useCallback((e) => {
        setFileList(e?.target?.files[0]);
    }, []);

    const handleInputChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setAdminData((prev) => ({ ...prev, [name]: value }));
        },
        [adminData, fileList]
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateProfile({
            profileData: adminData,
            setIsSubmitting,
            setIsEditing,
            setAdmin,
            token,
        });
    };

    return (
        <div>
            <div className='container mx-auto'>
                <div className='text-center mb-10'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                        {t("sidebar_profile")}
                    </h1>
                </div>

                <div className='max-w-6xl mx-auto'>
                    <div className='grid lg:grid-cols-3 gap-8'>
                        <div className='lg:col-span-1'>
                            <div className='rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8'>
                                <div className='text-center'>
                                    <div className='relative inline-block mb-6'>
                                        {loading || !admin?.image ? (
                                            <Skeleton className='size-32 rounded-full' />
                                        ) : (
                                            <div className='relative group'>
                                                <img
                                                    src={
                                                        fileList instanceof Blob
                                                            ? URL.createObjectURL(
                                                                  fileList
                                                              )
                                                            : fileList
                                                    }
                                                    alt={
                                                        admin?.name || "Profile"
                                                    }
                                                    className='size-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600 shadow-md transition-all duration-200 group-hover:scale-105'
                                                    draggable={false}
                                                />
                                            </div>
                                        )}
                                        {isEditing && (
                                            <label
                                                htmlFor='image'
                                                className='absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 cursor-pointer shadow-md border-2 border-white dark:border-gray-700 flex items-center justify-center duration-75 active:scale-90 will-change-transform'>
                                                <Camera size={16} />
                                                <input
                                                    type='file'
                                                    name='image'
                                                    id='image'
                                                    accept='image/*'
                                                    onChange={handleImageChange}
                                                    hidden
                                                />
                                            </label>
                                        )}
                                    </div>

                                    <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-2'>
                                        {admin?.name || "Admin"}
                                    </h2>
                                    <p className='p-2 w-max mx-auto text-sm leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-200 text-green-800 dark:text-green-900 text-center mb-4'>
                                        {admin?.role || "Administrator"}
                                    </p>
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
                                                {admin?.role}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='lg:col-span-2'>
                            <motion.div
                                layout
                                transition={{ duration: 0.1 }}
                                className='rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8'>
                                <div className='flex items-center justify-between mb-8'>
                                    <h3 className='text-2xl font-semibold text-gray-900 dark:text-white'>
                                        {t("edit_profile")}
                                    </h3>
                                    <button
                                        type='button'
                                        onClick={() => setIsEditing(!isEditing)}
                                        disabled={isSubmitting || loading}
                                        className={`flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed! disabled:hover:opacity-25 transition-all duration-200 px-4 py-2 not-disabled:active:scale-95 will-change-transform ${
                                            isEditing
                                                ? "bg-red-500"
                                                : "bg-blue-600 hover:bg-blue-700"
                                        } text-white rounded-lg font-medium`}>
                                        {isEditing ? (
                                            <>
                                                <XIcon size={16} />
                                                {t("cancel")}
                                            </>
                                        ) : (
                                            <>
                                                <Edit3 size={16} />
                                                {t("edit")}
                                            </>
                                        )}
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className='space-y-6'>
                                    <div className='grid md:grid-cols-2 gap-6'>
                                        <div>
                                            <label className='block text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                                {t("modal_admin_name")}
                                            </label>
                                            <input
                                                type='text'
                                                name='name'
                                                value={admin?.name || ""}
                                                onChange={handleInputChange}
                                                disabled={
                                                    !isEditing || isSubmitting
                                                }
                                                className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed outline-none ${
                                                    !isEditing
                                                        ? "select-none"
                                                        : ""
                                                }`}
                                                required
                                                autoComplete='off'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                                {t("modal_admin_username")}
                                            </label>
                                            <input
                                                type='text'
                                                name='username'
                                                value={admin?.username || ""}
                                                onChange={handleInputChange}
                                                disabled={
                                                    !isEditing || isSubmitting
                                                }
                                                className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed outline-none ${
                                                    isEditing
                                                        ? "select-none"
                                                        : ""
                                                }`}
                                                required
                                                autoComplete='username'
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className='block text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                            {t("modal_admin_password")}
                                        </label>
                                        <div className='relative'>
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name='password'
                                                value={admin?.password || ""}
                                                onChange={handleInputChange}
                                                disabled={
                                                    !isEditing || isSubmitting
                                                }
                                                className='w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed outline-none'
                                                minLength={6}
                                            />
                                            <button
                                                type='button'
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'>
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
                                            <input
                                                id='phone'
                                                type='text'
                                                name='phone'
                                                value={admin?.phone || ""}
                                                onChange={handleInputChange}
                                                disabled={
                                                    !isEditing || isSubmitting
                                                }
                                                className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed outline-none ${
                                                    isEditing
                                                        ? "select-none"
                                                        : ""
                                                }`}
                                                pattern='^\d{9}$'
                                                autoComplete='billing mobile tel'
                                            />
                                        </div>
                                        {isEditing && (
                                            <div className='flex'>
                                                <button
                                                    type='submit'
                                                    disabled={isSubmitting}
                                                    className='mt-auto max-h-[63%] w-full p-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3  not-disabled:active:scale-95 will-change-transform'>
                                                    {isSubmitting ? (
                                                        <>
                                                            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                                            <span>
                                                                {t("saving")}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save size={20} />
                                                            <span>
                                                                {t("save")}
                                                            </span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardProfile;
