import axios from "axios";
import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { baseURL } from "../../App";
import Modal from "../../components/ui/Modal/Modal";
import Preloader from "../../components/ui/Preloader/Preloader";
import Table from "../../components/ui/Table/Table";
import PhoneInput from "../../helpers/FormatPhone";
import { adminSchema } from "../../validation/adminSchema";

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
    const [showPassword, setShowPassword] = useState(false);
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
        // setCreateAdminLoading(true);

        const formData = new FormData();
        formData.append("name", adminName);
        formData.append("username", adminUsername);
        formData.append("password", adminPassword);
        formData.append("image", adminImage);
        formData.append("phone", adminPhone);
        formData.append("role", adminRole);
        console.log(...formData);

        // try {
        //     const response = await axios.post(
        //         `${baseURL}/admin/create`,
        //         formData,
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${token}`,
        //                 "Content-Type": "multipart/form-data",
        //             },
        //         }
        //     );
        //     if (response.status === 201) {
        //         toast.success(response.data.message);
        //     }
        // } catch (error) {
        //     toast.error(error.response.data.error);
        // } finally {
        //     setCreateAdminLoading(false);
        // }
    };

    useEffect(() => {
        getAdmins();
        document.title = "WorkCheck - Dashboard | Adminlar";
    }, []);

    const formik = useFormik({
        initialValues: {
            name: "",
            adminUsername: "",
            adminPassword: "",
            adminRole: "",
            adminImage: null,
        },
        validationSchema: adminSchema,
        onSubmit: async (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("username", values.adminUsername);
            formData.append("password", values.adminPassword);
            formData.append("phone", values.adminPhone || "");
            formData.append("role", values.adminRole);
            formData.append("image", values.adminImage);
            try {
                setCreateAdminLoading(true);
                const res = await axios.post(
                    `${baseURL}/admin/create`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                toast.success(res.data.message);
                resetForm();
                setModalOpen(false);
                // refresh list
                setAdmins((prev) => [...prev, res.data.admin]);
            } catch (err) {
                toast.error(err.response?.data?.error || err.message);
            } finally {
                setCreateAdminLoading(false);
            }
        },
    });

    useEffect(() => {
        console.log(formik);
    }, [formik]);

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

                    <Modal
                        visible={addAdminModal}
                        title={t("add_admin")}
                        onCancel={() => setAddAdminModal(false)}
                        onOk={() => formik.submitForm()}
                        Disable={!(formik.isValid && formik.dirty)}>
                        <form className='grid grid-cols-2 gap-4'>
                            {/* Name */}
                            <div>
                                <label htmlFor='name' className='block mb-1'>
                                    {t("modal_admin_name")}:
                                </label>
                                <input
                                    id='name'
                                    name='name'
                                    type='text'
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className='w-full border p-2 rounded'
                                    autoComplete='name'
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <p className='text-red-600 text-sm'>
                                        {formik.errors.name}
                                    </p>
                                )}
                            </div>
                            {/* Username */}
                            <div>
                                <label
                                    htmlFor='adminUsername'
                                    className='block mb-1'>
                                    {t("modal_admin_username")}:
                                </label>
                                <input
                                    id='adminUsername'
                                    name='adminUsername'
                                    type='text'
                                    value={formik.values.adminUsername}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className='w-full border p-2 rounded'
                                    autoComplete='username'
                                />
                                {formik.touched.adminUsername &&
                                    formik.errors.adminUsername && (
                                        <p className='text-red-600 text-sm'>
                                            {formik.errors.adminUsername}
                                        </p>
                                    )}
                            </div>
                            {/* Password */}
                            <div>
                                <label
                                    htmlFor='adminPassword'
                                    className='block mb-1'>
                                    {t("modal_admin_password")}:
                                </label>
                                <div className='relative'>
                                    <input
                                        id='adminPassword'
                                        name='adminPassword'
                                        type={
                                            formik.showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={formik.values.adminPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className='w-full border p-2 rounded'
                                        autoComplete='new-password'
                                    />
                                    <button
                                        type='button'
                                        onClick={() =>
                                            formik.setFieldValue(
                                                "showPassword",
                                                !formik.showPassword
                                            )
                                        }
                                        className='absolute right-2 top-2'>
                                        {formik.showPassword ? (
                                            <EyeOff />
                                        ) : (
                                            <Eye />
                                        )}
                                    </button>
                                </div>
                                {formik.touched.adminPassword &&
                                    formik.errors.adminPassword && (
                                        <p className='text-red-600 text-sm'>
                                            {formik.errors.adminPassword}
                                        </p>
                                    )}
                            </div>
                            {/* Role */}
                            <div>
                                <label
                                    htmlFor='adminRole'
                                    className='block mb-1'>
                                    {t("modal_admin_role")}:
                                </label>
                                <select
                                    id='adminRole'
                                    name='adminRole'
                                    value={formik.values.adminRole}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className='w-full border p-2 rounded'>
                                    <option value=''>{t("select_role")}</option>
                                    <option value='ADMIN'>Admin</option>
                                    <option value='SUPERADMIN'>
                                        Super-admin
                                    </option>
                                </select>
                                {formik.touched.adminRole &&
                                    formik.errors.adminRole && (
                                        <p className='text-red-600 text-sm'>
                                            {formik.errors.adminRole}
                                        </p>
                                    )}
                            </div>
                            {/* Phone */}
                            <div>
                                <PhoneInput
                                    label={t("modal_admin_phone")}
                                    name='adminPhone'
                                    value={formik.values.adminPhone}
                                    onChange={(value) =>
                                        formik.setFieldValue(
                                            "adminPhone",
                                            value
                                        )
                                    }
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {/* Image */}
                            <div className='col-span-2'>
                                <label
                                    htmlFor='adminImage'
                                    className='block mb-1'>
                                    {t("modal_admin_image")}:
                                </label>
                                <input
                                    id='adminImage'
                                    name='adminImage'
                                    type='file'
                                    accept='image/*'
                                    onChange={(e) =>
                                        formik.setFieldValue(
                                            "adminImage",
                                            e.currentTarget.files[0]
                                        )
                                    }
                                    onBlur={formik.handleBlur}
                                    className='w-full'
                                    autoComplete='off'
                                />
                                {formik.touched.adminImage &&
                                    formik.errors.adminImage && (
                                        <p className='text-red-600 text-sm'>
                                            {formik.errors.adminImage}
                                        </p>
                                    )}
                            </div>
                        </form>
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
