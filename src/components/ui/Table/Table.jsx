import { motion } from "framer-motion";
import { UserRoundMinus, UserRoundPen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAdmin } from "../../../hooks/useAdmin";

function Table({ data, deleteOnClick, editOnClick, editLoading = {} }) {
    const { t } = useTranslation();
    const { isSuperAdmin } = useAdmin();

    return (
        <div className='w-full overflow-x-auto'>
            <table className='min-w-full table-auto'>
                <thead className='bg-gray-50 dark:bg-[#222]'>
                    <tr>
                        <th className='px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                            {t("admin_table_img")}
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                            {t("admin_table_name")}
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                            {t("admin_table_username")}
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                            {t("admin_table_role")}
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                            {t("admin_table_phone")}
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                            {t("admin_table_branch")}
                        </th>
                        {isSuperAdmin && (
                            <motion.th
                                layout
                                className='px-6 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                {t("admin_table_action")}
                            </motion.th>
                        )}
                    </tr>
                </thead>
                <tbody className='bg-white dark:bg-[#111010] divide-y divide-gray-200 dark:divide-gray-700'>
                    {data.map((item) => (
                        <tr
                            key={item?.id}
                            className='hover:bg-gray-100 dark:hover:bg-[#222] transition-colors'>
                            <td className='px-6 py-4 whitespace-nowrap'>
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
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <span className='px-2 inline-flex text-sm leading-5 font-semibold rounded-full'>
                                    {item?.branch?.name}
                                </span>
                            </td>
                            {isSuperAdmin && (
                                <motion.td layout className='px-6 py-4'>
                                    <div className='flex gap-2.5 items-center justify-around'>
                                        <button
                                            disabled={editLoading[item.id]}
                                            aria-label={
                                                item?.id + `it's a edit button`
                                            }
                                            onClick={() => editOnClick(item.id)}
                                            title='Click to edit'
                                            className='px-[10px] py-[5px] text-white bg-blue-600/80 hover:bg-blue-600 rounded-lg transition active:scale-[0.95]'>
                                            <UserRoundPen size={22} />
                                        </button>
                                        <button
                                            aria-label={
                                                item?.id +
                                                `it's a delete button`
                                            }
                                            onClick={() =>
                                                deleteOnClick(item.id)
                                            }
                                            title='Click to delete'
                                            className='px-[10px] py-[5px] text-white bg-red-600/80 hover:bg-red-600 rounded-lg transition active:scale-[0.95]'>
                                            <UserRoundMinus size={22} />
                                        </button>
                                    </div>
                                </motion.td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default Table;
