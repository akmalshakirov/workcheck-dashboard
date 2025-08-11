import { motion } from "framer-motion";
import {
    Building,
    Camera,
    CheckCircle,
    Edit3,
    Eye,
    EyeOff,
    Save,
    User,
    XIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../../components/ui/Skeleton/Skeleton";
import { useAdmin } from "../../hooks/useAdmin";
import { updateProfile } from "../../service/api/api";

const DashboardProfile = () => {
    const token = localStorage.getItem("token");
    const { admin, branch, setAdmin, loading } = useAdmin();
    const { t } = useTranslation();
    const [adminData, setAdminData] = useState({
        name: admin?.name || "",
        username: admin?.username || "",
        password: "",
        branch: "",
        image: admin?.image || "",
        role: admin?.role || "",
        phone: admin?.phone || "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        document.title = `WorkCheck - Dashboard | ${t("sidebar_profile")}`;
    }, [t]);

    useEffect(() => {
        if (admin) {
            setAdminData({
                name: admin.name || "",
                username: admin.username || "",
                password: "",
                branch:
                    typeof branch === "object"
                        ? branch?.name || ""
                        : branch || "",
                role: admin.role || "",
                phone: admin.phone || "",
            });
            setFileList(admin.image);
        }
    }, [admin, branch]);

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

    const handleSubmit = async () => {
        await updateProfile({
            profileData: adminData,
            setIsSubmitting,
            setShowSuccess,
            setIsEditing,
            setAdmin,
            token,
        });
    };

    return (
        <div>
            {showSuccess && (
                <div className='fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-right duration-300'>
                    <CheckCircle size={20} />
                    <span className='font-medium'>
                        {t("saved_successfully")}
                    </span>
                </div>
            )}

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
                                        {loading || !fileList ? (
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
                                                        adminData?.name ||
                                                        "Profile"
                                                    }
                                                    className='size-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600 shadow-md transition-all duration-200 group-hover:scale-105'
                                                    draggable={false}
                                                />
                                            </div>
                                        )}
                                        {isEditing && (
                                            <label
                                                htmlFor='image'
                                                className='absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 cursor-pointer shadow-md border-2 border-white dark:border-gray-700 flex items-center justify-center transition-colors duration-200'>
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
                                        {adminData.name || "Admin"}
                                    </h2>
                                    <p className='p-2 w-max mx-auto text-sm leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-200 text-green-800 dark:text-green-900 text-center mb-4'>
                                        {adminData.role || "Administrator"}
                                    </p>
                                    {!admin?.branch ? (
                                        <Skeleton className='inline-flex items-center w-24 h-9' />
                                    ) : (
                                        <div className='inline-flex items-center gap-2 text-base text-black/70 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg'>
                                            <Building size={16} />
                                            <span>
                                                {admin?.branch?.name ||
                                                    admin?.branch}
                                            </span>
                                        </div>
                                    )}
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
                                                {adminData.role ? (
                                                    <p className='font-semibold text-gray-900 dark:text-white'>
                                                        {adminData?.role}
                                                    </p>
                                                ) : (
                                                    <Skeleton className='w-28 h-6' />
                                                )}
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
                                        className={`flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed! disabled:hover:opacity-25 transition-opacity duration-200 px-4 py-2  ${
                                            isEditing
                                                ? "bg-red-500"
                                                : "bg-blue-600 hover:bg-blue-700"
                                        } text-white rounded-lg font-medium transition-colors duration-200`}>
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
                                                value={adminData.name || ""}
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
                                                value={adminData.username || ""}
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
                                                value={adminData.password || ""}
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
                                                value={adminData.phone || ""}
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
                                            <div>
                                                <button
                                                    type='submit'
                                                    disabled={isSubmitting}
                                                    className='p-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3'>
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
                                        {/* <div>
                                            <label className='block text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                                {t("modal_admin_role")}
                                            </label>
                                            <input
                                                type='text'
                                                name='role'
                                                value={adminData.role || ""}
                                                readOnly
                                                className='w-full outline-none px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                                autoComplete='off'
                                            />
                                        </div> */}
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
