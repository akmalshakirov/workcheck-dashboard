import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
    Eye,
    EyeOff,
    EyeOffIcon,
    Loader2Icon,
    UploadIcon,
    UserRoundMinus,
    UserRoundPen,
    UserRoundPlus,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { baseURL } from "../../App";
import { CustomTable } from "../../components/CustomTable";
import { Button } from "../../components/ui/Button/Button";
import { Modal } from "../../components/ui/Modal/Modal";
import { Skeleton } from "../../components/ui/Skeleton/Skeleton";
import PhoneInput from "../../helpers/FormatPhone";
import { useAdmin } from "../../hooks/useAdmin";
import { useApi } from "../../service/api/api";
const MySwal = withReactContent(Swal);
const theme = localStorage.getItem("isDark");

const defaultAdminData = {
    name: "",
    username: "",
    password: "",
    phone: "",
    role: "ADMIN",
    branchId: "",
    image: null,
};

const DashboardAdmins = () => {
    const token = localStorage.getItem("token");
    const lang = localStorage.getItem("lang");
    const { t } = useTranslation();
    const { branch } = useAdmin();

    const [admins, setAdmins] = useState([]);
    const [preloader, setPreloader] = useState(false);
    const [createAdminModal, setCreateAdminModal] = useState(false);
    const [createAdminLoading, setCreateAdminLoading] = useState(false);
    const [adminData, setAdminData] = useState(defaultAdminData);
    const [showPassword, setShowPassword] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);
    const { getAdmins } = useApi();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [getAdminLoading, setGetAdminLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState(defaultAdminData);

    const handleInputChange = (e, isEdit = false) => {
        const { name, value, files } = e.target;
        if (files) {
            (isEdit ? setEditData : setAdminData)((prev) => ({
                ...prev,
                image: files[0],
            }));
        } else {
            (isEdit ? setEditData : setAdminData)((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const defaultList = [
        {
            header: t("admin_table_img"),
            value: (item) => (
                <img
                    src={item.image}
                    alt={item.image}
                    className='size-15 rounded-full object-cover'
                    draggable={false}
                />
            ),
            key: "img",
        },
        {
            header: t("admin_table_name"),
            key: "name",
        },
        {
            header: t("admin_table_username"),
            key: "username",
        },
        {
            header: t("admin_table_role"),
            key: "role",
        },
        {
            header: t("admin_table_phone"),
            key: "phone",
        },
        {
            header: t("admin_table_branch"),
            key: "branchId",
            value: (item) => item?.branch?.name,
        },
    ];

    const handlePhoneChange = (value, isEdit = false) => {
        (isEdit ? setEditData : setAdminData)((prev) => ({
            ...prev,
            phone: value,
        }));
    };

    const fetchAdmins = useCallback(() => {
        getAdmins({ setPreloader, setAdmins });
    }, [token]);

    useEffect(() => {
        fetchAdmins();
    }, []);

    useEffect(() => {
        document.title = `WorkCheck - Dashboard | ${
            t("sidebar_admins") || "Adminlar"
        }`;
    }, [t]);

    // Create admin
    const createAdmin = async (e) => {
        e.preventDefault();
        setCreateAdminLoading(true);
        const formData = new FormData(e.target);
        // Object.entries(adminData).forEach(([key, val]) => {
        //     if (val) formData.append(key, val);
        // });
        // difference e.target and this code is on the phone format,
        // like this:
        // e.target: (99)-999-99-99 and
        // this code: 999999999

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
                fetchAdmins();
                setAdminData(defaultAdminData);
                showSwal("success", response.data.message);
            }
        } catch (error) {
            showSwal("error", error?.response?.data?.error);
        } finally {
            setCreateAdminLoading(false);
            setCreateAdminModal(false);
        }
    };

    // Edit admin
    const handleGetAdminById = async (item) => {
        setIsEditModalOpen(true);
        setGetAdminLoading(true);
        setEditId(item.id);
        try {
            const { data } = await axios.get(`${baseURL}/admin/${item.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEditData({
                name: data.admin.name || "",
                username: data.admin.username || "",
                password: "",
                phone: data.admin.phone || "",
                role: data.admin.role || "ADMIN",
                branchId: data.admin.branch?.id || "",
                image: data.admin.image || null,
            });
        } catch (error) {
            setIsEditModalOpen(false);
            showSwal("error", error?.response?.data?.error);
        } finally {
            setGetAdminLoading(false);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        const formData = new FormData();
        Object.entries(editData).forEach(([key, val]) => {
            if (val) formData.append(key, val);
        });

        try {
            const response = await axios.put(
                `${baseURL}/admin/${editId}/update`,
                formData,
                { headers: { Authorization: `Bearer ${token}`, Accept: lang } }
            );
            if (response.status === 200) {
                showSwal("success", response.data.message);
                setIsEditModalOpen(false);
                fetchAdmins();
            }
        } catch (error) {
            showSwal("error", error?.response?.data?.error);
        } finally {
            setEditLoading(false);
        }
    };

    // Delete admin
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
            theme: theme == "true" ? "dark" : "light",
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: t("preloader"),
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
            try {
                const response = await axios.delete(
                    `${baseURL}/admin/${id}/delete`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: lang,
                        },
                    }
                );
                Swal.close();
                showSwal("success", response.data.message);
                fetchAdmins();
            } catch (error) {
                Swal.close();
                showSwal("error", error?.response?.data?.error);
            }
        }
    };

    const showSwal = (icon, title) => {
        Swal.fire({
            title,
            icon,
            confirmButtonText: t("ok2"),
            timer: icon === "success" ? 5000 : undefined,
            theme: theme == "true" ? "dark" : "light",
        });
    };

    const renderInput = ({
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
        isEdit = false,
        ...rest
    }) => {
        const isPassword = name === "password";
        const show = isEdit ? showEditPassword : showPassword;
        const setShow = isEdit ? setShowEditPassword : setShowPassword;
        return (
            <div className='flex flex-col gap-1'>
                <label htmlFor={id} className='text-base'>
                    {label}
                </label>
                <div className='relative'>
                    <input
                        type={isPassword ? (show ? "text" : "password") : type}
                        id={id}
                        name={name}
                        className='border rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600 w-full pr-10'
                        minLength={minLength}
                        maxLength={maxLength}
                        value={value}
                        onChange={onChange}
                        required={required}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        {...rest}
                    />
                    {isPassword && (
                        <button
                            type='button'
                            tabIndex={-1}
                            className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            onClick={() => setShow((prev) => !prev)}
                            aria-label={
                                show ? t("hide_password") : t("show_password")
                            }>
                            {show ? (
                                <Eye size={20} />
                            ) : (
                                <EyeOffIcon size={20} />
                            )}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderSelect = ({
        id,
        name,
        label,
        value,
        onChange,
        options,
        required = true,
        defaultChecked = false,
    }) => (
        <div className='flex flex-col gap-1'>
            <label htmlFor={id} className='text-base'>
                {label}
            </label>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                defaultChecked={defaultChecked}
                className='border rounded-lg border-gray-500/70 px-3 py-2 text-base outline-none focus:border-blue-400 duration-150 dark:border-gray-600 dark:bg-[#0f0f0f]'
                required={required}>
                <option disabled value=''>
                    {t("select_role")}
                </option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );

    const renderImagePreview = (fileOrUrl) => {
        if (!fileOrUrl) return null;
        const src =
            typeof fileOrUrl === "string"
                ? fileOrUrl
                : URL.createObjectURL(fileOrUrl);
        return (
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className='block border border-blue-500 bg-blue-300/10 p-4 rounded cursor-pointer mt-4'>
                <div className='flex gap-4'>
                    <div className='max-w-1/4'>
                        <img
                            src={src}
                            alt='Admin Image'
                            className='object-contain rounded-lg w-full h-full'
                        />
                    </div>
                    <div>
                        <p>{t("image_preview")}:</p>
                        <img
                            src={src}
                            alt='Admin Image'
                            className='object-cover w-30 h-30 rounded-full p-2'
                        />
                    </div>
                </div>
            </motion.div>
        );
    };

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
                    <div className='flex items-center justify-between mb-5'>
                        <h1 className='text-2xl font-bold'>
                            {t("sidebar_admins")}
                        </h1>
                        <Button
                            size='sm'
                            leftIcon={<UserRoundPlus size={18} />}
                            onClick={() => setCreateAdminModal(true)}>
                            {t("add_admin")}
                        </Button>
                    </div>
                    <div>
                        {!admins || admins.length === 0 ? (
                            <h1>{t("no_admins_error")}</h1>
                        ) : (
                            <CustomTable
                                columns={defaultList}
                                loading={preloader}
                                data={admins}
                                onDelete={handleDelete}
                                onEdit={handleGetAdminById}
                                showIndex
                                editIcon={
                                    <UserRoundPen className='text-white' />
                                }
                                deleteIcon={
                                    <UserRoundMinus className='text-white' />
                                }
                                actions={"edit delete"}
                            />
                        )}
                    </div>

                    {/* Create admin modal */}
                    <Modal
                        visible={createAdminModal}
                        title={t("add_admin")}
                        width='70'>
                        <form onSubmit={createAdmin}>
                            <div className='flex gap-10'>
                                <div className='w-1/2'>
                                    {renderInput({
                                        id: "admin-name",
                                        name: "name",
                                        label: t("modal_admin_name") + ":",
                                        value: adminData.name,
                                        onChange: handleInputChange,
                                        placeholder: "adminbek",
                                        autoComplete: "name",
                                    })}
                                    {renderInput({
                                        id: "admin-username",
                                        name: "username",
                                        label: t("modal_admin_username") + ":",
                                        value: adminData.username,
                                        onChange: handleInputChange,
                                        placeholder: "admin",
                                        autoComplete: "username",
                                    })}
                                    <div className='flex flex-col gap-1 relative'>
                                        <label
                                            htmlFor='admin-password'
                                            className='text-base'>
                                            {t("modal_admin_password")}:
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
                                            onChange={handleInputChange}
                                            required
                                            placeholder='12345678'
                                            autoComplete='new-password'
                                        />
                                        <button
                                            type='button'
                                            onClick={() =>
                                                setShowPassword((curr) => !curr)
                                            }
                                            className='absolute top-9.5 ml-2 right-3 text-gray-500 hover:text-gray-700'
                                            tabIndex={-1}
                                            disabled={createAdminLoading}
                                            aria-label='Show password button'
                                            title='Show password'>
                                            {showPassword ? (
                                                <EyeOff size={20} />
                                            ) : (
                                                <Eye size={20} />
                                            )}
                                        </button>
                                    </div>
                                    <PhoneInput
                                        value={adminData.phone}
                                        onChange={(val) =>
                                            handlePhoneChange(val)
                                        }
                                        label={t("modal_admin_phone") + ":"}
                                        name='phone'
                                        required
                                    />
                                    {renderSelect({
                                        id: "admin-role",
                                        name: "role",
                                        label: t("modal_admin_role") + ":",
                                        value: adminData.role,
                                        onChange: handleInputChange,
                                        options: [
                                            { value: "ADMIN", label: "Admin" },
                                            {
                                                value: "SUPERADMIN",
                                                label: "Super-admin",
                                            },
                                        ],
                                    })}
                                </div>
                                <div className='flex-1'>
                                    <div className='flex flex-col gap-1'>
                                        <p className='mr-2'>
                                            {t("select_branch")}:
                                        </p>
                                        {branch === null ? (
                                            <Skeleton className='w-full h-10 rounded-lg' />
                                        ) : (
                                            <select
                                                defaultChecked=''
                                                name='branchId'
                                                className='border w-full rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                                value={adminData.branchId}
                                                onChange={handleInputChange}>
                                                <option value='' disabled>
                                                    {t("select_branch")}
                                                </option>
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
                                    <label
                                        htmlFor='image'
                                        className='cursor-pointer flex flex-col md:flex'>
                                        {adminData.image
                                            ? t("selected_image")
                                            : t("choose_image")}
                                        {!adminData.image && (
                                            <motion.div
                                                whileTap={{ scale: 0.98 }}
                                                className='flex gap-2 px-2 py-5 border border-blue-500 bg-blue-400/20 rounded'>
                                                {t("image_dropzone")}
                                                <UploadIcon />
                                            </motion.div>
                                        )}
                                        <input
                                            hidden
                                            id='image'
                                            type='file'
                                            name='image'
                                            onChange={handleInputChange}
                                            autoComplete='off'
                                            multiple={false}
                                            accept='image/*'
                                        />
                                    </label>
                                    {renderImagePreview(adminData.image)}
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
                                    {t("close")}
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
                                            <Loader2Icon
                                                className='animate-spin'
                                                style={{
                                                    animationDuration: "1.5s",
                                                }}
                                            />
                                        </>
                                    ) : (
                                        t("ok")
                                    )}
                                </button>
                            </div>
                        </form>
                    </Modal>

                    {/* Update admin modal */}
                    <Modal
                        title={t("modal_admin_update")}
                        visible={isEditModalOpen}
                        width='70'>
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
                                    <form onSubmit={handleEdit}>
                                        <div className='flex gap-10'>
                                            <div className='w-1/2'>
                                                {renderInput({
                                                    id: "edit-admin-name",
                                                    name: "name",
                                                    label:
                                                        t("modal_admin_name") +
                                                        ":",
                                                    value: editData.name,
                                                    onChange: (e) =>
                                                        handleInputChange(
                                                            e,
                                                            true
                                                        ),
                                                    autoComplete: "name",
                                                })}
                                                {renderInput({
                                                    id: "edit-admin-username",
                                                    name: "username",
                                                    label:
                                                        t(
                                                            "modal_admin_username"
                                                        ) + ":",
                                                    value: editData.username,
                                                    onChange: (e) =>
                                                        handleInputChange(
                                                            e,
                                                            true
                                                        ),
                                                    autoComplete: "username",
                                                })}
                                                <PhoneInput
                                                    value={editData.phone}
                                                    onChange={(val) =>
                                                        handlePhoneChange(
                                                            val,
                                                            true
                                                        )
                                                    }
                                                    label={
                                                        t("modal_admin_phone") +
                                                        ":"
                                                    }
                                                    name='phone'
                                                    required
                                                />
                                                {renderSelect({
                                                    id: "edit-admin-role",
                                                    name: "role",
                                                    label:
                                                        t("modal_admin_role") +
                                                        ":",
                                                    value: editData.role,
                                                    onChange: (e) =>
                                                        handleInputChange(
                                                            e,
                                                            true
                                                        ),
                                                    options: [
                                                        {
                                                            value: "ADMIN",
                                                            label: "Admin",
                                                        },
                                                        {
                                                            value: "SUPERADMIN",
                                                            label: "Super-admin",
                                                        },
                                                    ],
                                                })}
                                                {renderInput({
                                                    id: "edit-admin-password",
                                                    name: "password",
                                                    label:
                                                        t(
                                                            "modal_admin_password"
                                                        ) + ":",
                                                    type: "password",
                                                    value: editData.password,
                                                    onChange: (e) =>
                                                        handleInputChange(
                                                            e,
                                                            true
                                                        ),
                                                    autoComplete:
                                                        "current-password",
                                                    required: false,
                                                })}
                                            </div>
                                            <div className='flex-1'>
                                                <div className='flex flex-col gap-1'>
                                                    <p className='mr-2'>
                                                        {branch === null
                                                            ? t("select_branch")
                                                            : t(
                                                                  "admin_s_branch"
                                                              )}
                                                        :
                                                    </p>
                                                    {branch === null ? (
                                                        <Skeleton className='w-full h-10 rounded-lg' />
                                                    ) : (
                                                        <select
                                                            defaultChecked=''
                                                            name='branchId'
                                                            className='border w-full rounded-lg border-gray-500/70 px-3 py-2 text-[14px] outline-none focus:border-blue-400 duration-150 dark:border-gray-600'
                                                            value={
                                                                editData.branchId
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    true
                                                                )
                                                            }>
                                                            <option
                                                                value=''
                                                                disabled>
                                                                {t(
                                                                    "select_branch"
                                                                )}
                                                            </option>
                                                            {branch?.length >
                                                                0 &&
                                                                branch.map(
                                                                    (b) => (
                                                                        <option
                                                                            value={
                                                                                b.id
                                                                            }
                                                                            key={
                                                                                b.id
                                                                            }>
                                                                            {
                                                                                b.name
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                        </select>
                                                    )}
                                                </div>
                                                <label
                                                    htmlFor='edit-image'
                                                    className='cursor-pointer flex flex-col'>
                                                    {editData.image
                                                        ? t("selected_image")
                                                        : t("choose_image")}
                                                    {!editData.image && (
                                                        <motion.div
                                                            whileTap={{
                                                                scale: 0.98,
                                                            }}
                                                            className='flex gap-2 px-2 py-5 border border-blue-500 bg-blue-400/20 rounded'>
                                                            {t(
                                                                "image_dropzone"
                                                            )}
                                                            <UploadIcon />
                                                        </motion.div>
                                                    )}
                                                    <input
                                                        hidden
                                                        id='edit-image'
                                                        type='file'
                                                        name='image'
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                e,
                                                                true
                                                            )
                                                        }
                                                        autoComplete='off'
                                                        multiple={false}
                                                        accept='image/*'
                                                    />
                                                </label>
                                                {renderImagePreview(
                                                    editData.image
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
                                                {editLoading ? (
                                                    <div className='flex items-center'>
                                                        <Loader2Icon
                                                            className='animate-spin'
                                                            style={{
                                                                animationDuration:
                                                                    "1.5s",
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    t("ok")
                                                )}
                                            </button>
                                        </div>
                                    </form>
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
