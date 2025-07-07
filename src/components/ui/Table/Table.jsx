import axios from "axios";
import {
    Eye,
    EyeOff,
    Loader2Icon,
    UserRoundMinus,
    UserRoundPen,
} from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { baseURL } from "../../../App";
import PhoneInput from "../../../helpers/FormatPhone";
import Modal from "../Modal/Modal";
import UploadImage from "../UploadImage/UploadImage";

function Table({ data }) {
    const token = localStorage.getItem("token");
    const [admin, setAdmin] = useState([]);
    const [editLoading, setEditLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { t } = useTranslation();
    const [id, setId] = useState(null);
    const [adminName, setAdminName] = useState("");
    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [adminPhone, setAdminPhone] = useState("");
    const [adminRole, setAdminRole] = useState("ADMIN");
    const [adminImage, setAdminImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [getAdminLoading, setGetAdminLoading] = useState(true);

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

    const handleEdit = async (e) => {
        e.preventDefault();
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
            const response = await axios.put(
                `${baseURL}/admin/${id}/update`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) toast.success(response.data.message);
        } catch (error) {
            console.log(error);
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <div className='overflow-x-auto bg-white dark:bg-[#222] rounded-lg shadow'>
            <Modal title='Adminni tahrirlash' visible={isEditModalOpen}>
                {getAdminLoading ? (
                    <div className='w-[900px] h-[400px]'>
                        <h1 className='text-2xl'>{t("preloader")}... </h1>
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
                                                setAdminName(e.target.value)
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
                                            defaultValue={admin.username}
                                            onChange={(e) =>
                                                setAdminUsername(e.target.value)
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
                                                setAdminPassword(e.target.value)
                                            }
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
                                            onChange={(e) => setAdminPhone(e)}
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
                                                setAdminRole(e.target.value);
                                            }}
                                            id='admin-role'
                                            className='border rounded-lg border-gray-500/70 px-3 py-2 text-base outline-none focus:border-blue-400 duration-150 dark:border-gray-600'>
                                            <option disabled>
                                                Role tanlang...
                                            </option>
                                            <option value='ADMIN'>Admin</option>
                                            <option value='SUPERADMIN'>
                                                Super-admin
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className='flex flex-col w-1/2 gap-1'>
                                    <span>Rasm tanlang:</span>
                                    <UploadImage onFileBinary={(e) => e} />
                                </div>
                            </div>
                            <div className='flex justify-end gap-3 mt-4'>
                                <button
                                    type='button'
                                    className={`py-2 px-2.5 rounded-lg border-none cursor-pointer bg-red-600/80 hover:bg-red-600 duration-150 text-white w-max active:scale-[0.95] will-change-transform`}
                                    onClick={() => setIsEditModalOpen(false)}>
                                    {t("cancel")}
                                </button>
                                <button
                                    className={`py-2 px-2.5 rounded-lg text-white border-none cursor-pointer bg-[#126ac9] duration-150 hover:bg-[#007bff] w-max active:scale-[0.95] will-change-transform ${
                                        editLoading ? "opacity-30" : ""
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
            <table className='min-w-full divide-y divide-gray-200 dark:bg-black'>
                <thead className='bg-gray-50 dark:bg-[#222]'>
                    <tr>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                            Rasm
                        </th>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                            Ism
                        </th>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                            Username
                        </th>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                            Role
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                            Telefon raqam
                        </th>
                        <th
                            scope='col'
                            className='px-6 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                            Amallar
                        </th>
                    </tr>
                </thead>
                <tbody className='bg-white dark:bg-[#111010] divide-y divide-gray-200 dark:divide-gray-700'>
                    {data.map((item) => (
                        <tr
                            key={item?.id}
                            className='hover:bg-gray-100 dark:hover:bg-[#222] transition-colors'>
                            <td className='px-6 py-4 whitespace-nowrap pr-10'>
                                <img
                                    draggable={false}
                                    fetchPriority='auto'
                                    loading='lazy'
                                    src={
                                        item?.image === null
                                            ? "https://alyeowbccvspelnnwqhy.supabase.co/storage/v1/object/public/images//defaultImage.png"
                                            : item?.image
                                    }
                                    alt={item?.name}
                                    className={`w-10 h-10 object-cover rounded-full ${
                                        item?.image !== null
                                            ? ""
                                            : "border p-[3px]"
                                    }`}
                                />
                            </td>
                            <td>
                                <div className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                                    <div className='px-6 py-4 whitespace-nowrap'>
                                        {item?.name}
                                    </div>
                                </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-500 dark:text-gray-400'>
                                    {item?.username}
                                </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <span className='px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-200 text-green-800 dark:text-green-900'>
                                    {item?.role}
                                </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <span className='px-2 inline-flex text-sm leading-5 font-semibold rounded-full'>
                                    +998{item?.phone}
                                </span>
                            </td>
                            <td className='px-6 py-4'>
                                <div className='flex items-center justify-around'>
                                    <button
                                        disabled={editLoading[item.id]}
                                        aria-label={
                                            item?.id + `it's a edit button`
                                        }
                                        onClick={() =>
                                            handleGetAdminById(item.id)
                                        }
                                        className='px-[10px] py-[5px] text-white bg-blue-600/80 hover:bg-blue-600 rounded-lg transition'>
                                        <UserRoundPen size={22} />
                                    </button>
                                    <button
                                        aria-label={
                                            item?.id + `it's a delete button`
                                        }
                                        onClick={() =>
                                            console.log("Delete", item?.id)
                                        }
                                        className='px-[10px] py-[5px] text-white bg-red-600/80 hover:bg-red-600 rounded-lg transition'>
                                        <UserRoundMinus size={22} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default Table;
