import {
    Building,
    Camera,
    CheckCircle,
    Edit3,
    Eye,
    EyeOff,
    Save,
    User
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../../components/ui/Skeleton/Skeleton";
import { useAdmin } from "../../hooks/useAdmin";
import { updateProfile, uploadImage } from "../../service/api/api";

const DashboardProfile = () => {
    const { admin, branch, setIsLoading, isLoading, setAdmin, setAdminContent } = useAdmin();
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
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        document.title = `WorkCheck - Dashboard | ${t("sidebar_profile")}`;
    }, [t]);

    // Update adminData when admin changes
    useEffect(() => {
        if (admin) {
            setAdminData({
                name: admin.name || "",
                username: admin.username || "",
                password: "",
                branch: typeof branch === 'object' ? branch?.name || "" : branch || "",
                image: admin.image || "",
                role: admin.role || "",
                phone: admin.phone || "",
            });
        }
    }, [admin, branch]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            handleImageUpload(files[0]);
        } else {
            setAdminData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleImageUpload = async (file) => {
        if (!file) return;

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No authentication token found");
            return;
        }

        await uploadImage({
            file,
            setAdmin,
            setAdminContent,
            setIsLoading,
            token,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No authentication token found");
            return;
        }

        await updateProfile({
            profileData: adminData,
            setIsSubmitting,
            setShowSuccess,
            setIsEditing,
            setAdmin,
            setAdminContent,
            token,
        });
    };

    // Helper function to safely get branch name
    const getBranchName = () => {
        if (typeof branch === 'object' && branch !== null) {
            return branch.name || "";
        }
        return branch || "";
    };

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            {showSuccess && (
                <div className='fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-right duration-300'>
                    <CheckCircle size={20} />
                    <span className='font-medium'>{t("saved_successfully")}</span>
                </div>
            )}
            
            <div className='container mx-auto px-6 py-8'>
                <div className='text-center mb-10'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                        {t("sidebar_profile")}
                    </h1>
                    <p className='text-gray-600 dark:text-gray-400'>
                        Manage your account settings and preferences
                    </p>
                </div>
                
                <div className='max-w-6xl mx-auto'>
                    <div className='grid lg:grid-cols-3 gap-8'>
                        <div className='lg:col-span-1'>
                            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8'>
                                <div className='text-center'>
                                    <div className='relative inline-block mb-6'>
                                        {isLoading || !adminData.image ? (
                                            <Skeleton className='size-32 rounded-full' />
                                        ) : (
                                            <div className='relative group'>
                                                <img
                                                    src={adminData.image}
                                                    alt={adminData?.name || "Profile"}
                                                    className='size-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600 shadow-md transition-all duration-200 group-hover:scale-105'
                                                />
                                                <div className='absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center'>
                                                    <Camera size={24} className='text-white' />
                                                </div>
                                            </div>
                                        )}
                                        <label
                                            htmlFor='image'
                                            className='absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 cursor-pointer shadow-md border-2 border-white dark:border-gray-700 flex items-center justify-center transition-colors duration-200'>
                                            <Camera size={16} />
                                            <input
                                                type='file'
                                                name='image'
                                                id='image'
                                                accept='image/*'
                                                onChange={handleInputChange}
                                                className='hidden'
                                            />
                                        </label>
                                    </div>
                                    
                                    <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-2'>
                                        {adminData.name || "Admin"}
                                    </h2>
                                    <p className='text-gray-600 dark:text-gray-400 mb-4'>
                                        {adminData.role || "Administrator"}
                                    </p>
                                    <div className='inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg'>
                                        <Building size={16} />
                                        <span>{getBranchName()}</span>
                                    </div>
                                </div>
                                
                                <div className='mt-8'>
                                    <div className='bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600'>
                                        <div className='flex items-center gap-4'>
                                            <div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center'>
                                                <User size={20} className='text-white' />
                                            </div>
                                            <div>
                                                <p className='text-sm text-gray-600 dark:text-gray-400'>Username</p>
                                                <p className='font-semibold text-gray-900 dark:text-white'>{adminData.username || ""}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className='lg:col-span-2'>
                            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8'>
                                <div className='flex items-center justify-between mb-8'>
                                    <h3 className='text-2xl font-semibold text-gray-900 dark:text-white'>
                                        {t("edit_profile")}
                                    </h3>
                                    <button
                                        type='button'
                                        onClick={() => setIsEditing(!isEditing)}
                                        className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200'>
                                        <Edit3 size={16} />
                                        {isEditing ? t("cancel") : t("edit")}
                                    </button>
                                </div>
                                
                                <form onSubmit={handleSubmit} className='space-y-6'>
                                    <div className='grid md:grid-cols-2 gap-6'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                                {t("modal_admin_name")}
                                            </label>
                                            <input
                                                type='text'
                                                name='name'
                                                value={adminData.name || ""}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                                placeholder='Enter your name'
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                                {t("modal_admin_username")}
                                            </label>
                                            <input
                                                type='text'
                                                name='username'
                                                value={adminData.username || ""}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                                placeholder='Enter username'
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                            {t("modal_admin_password")}
                                        </label>
                                        <div className='relative'>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name='password'
                                                value={adminData.password || ""}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className='w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                                placeholder='Enter new password (optional)'
                                                minLength={6}
                                            />
                                            <button
                                                type='button'
                                                onClick={() => setShowPassword(!showPassword)}
                                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'>
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className='grid md:grid-cols-2 gap-6'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                                {t("modal_admin_phone")}
                                            </label>
                                            <input
                                                type='text'
                                                name='phone'
                                                value={adminData.phone || ""}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                                placeholder='+998 XX XXX XX XX'
                                                pattern='^\+998\d{9}$'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                                {t("modal_admin_role")}
                                            </label>
                                            <input
                                                type='text'
                                                name='role'
                                                value={adminData.role || ""}
                                                readOnly
                                                className='w-full outline-none px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                                placeholder='Role'
                                            />
                                        </div>
                                    </div>
                                    
                                    {isEditing && (
                                        <div className='pt-6 border-t border-gray-200 dark:border-gray-700'>
                                            <button
                                                type='submit'
                                                disabled={isSubmitting}
                                                className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3'>
                                                {isSubmitting ? (
                                                    <>
                                                        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                                        <span>{t("saving")}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save size={20} />
                                                        <span>{t("save")}</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardProfile;
