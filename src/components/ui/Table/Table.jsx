import { UserRoundMinus, UserRoundPen } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function Table({ data, deleteOnClick, editOnClick }) {
    const token = localStorage.getItem("token");
    const [admin, setAdmin] = useState([]);
    const [editLoading, setEditLoading] = useState(false);
    const { t } = useTranslation();
    const [id, setId] = useState(null);
    const [adminName, setAdminName] = useState("");
    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [adminPhone, setAdminPhone] = useState("");
    const [adminRole, setAdminRole] = useState("ADMIN");
    const [adminImage, setAdminImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className='overflow-x-auto bg-white dark:bg-[#222] rounded-lg shadow'>
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
                                        onClick={() => editOnClick(item.id)}
                                        className='px-[10px] py-[5px] text-white bg-blue-600/80 hover:bg-blue-600 rounded-lg transition'>
                                        <UserRoundPen size={22} />
                                    </button>
                                    <button
                                        aria-label={
                                            item?.id + `it's a delete button`
                                        }
                                        onClick={() => deleteOnClick(item.id)}
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
