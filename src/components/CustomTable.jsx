import { motion } from "framer-motion";
import { t } from "i18next";
import { useAdmin } from "../hooks/useAdmin";

export function CustomTable({
    data,
    columns,
    actions,
    emptyMessage = t("no_data"),
    onEdit = () => {},
    onDelete = () => {},
    showHeader = true,
    className = "",
    deleteIcon = "Delete" || {},
    editIcon = "Edit" || {},
    showIndex = false,
}) {
    const { isSuperAdmin } = useAdmin();

    const isEmpty = !data || data.length === 0;

    if (isEmpty) {
        return (
            <div className='py-6 text-center text-base text-gray-600 dark:text-gray-300 w-full'>
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={className ?? ""}>
            <table className='rounded-lg min-w-full overflow-x-scroll lg:overflow-auto'>
                {showHeader && (
                    <thead className='bg-gray-200 dark:bg-white/20'>
                        <tr>
                            {showIndex && (
                                <th className='px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 text-center'>
                                    №
                                </th>
                            )}

                            {columns?.map((col, idx) => (
                                <th
                                    key={col.key ?? idx}
                                    scope='col'
                                    className={`px-4 py-3 text-xs font-medium uppercase tracking-wider text-center text-gray-500 dark:text-gray-300 ${
                                        col.width ?? ""
                                    } ${col.className ?? ""}`}>
                                    {col.header}
                                </th>
                            ))}

                            {isSuperAdmin && actions && (
                                <motion.th
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className='px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                                    {t("admin_table_action")}
                                </motion.th>
                            )}
                        </tr>
                    </thead>
                )}

                <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
                    {data?.map((item, rowIdx) => {
                        return (
                            <tr
                                key={item?.id ?? rowIdx}
                                className='hover:bg-gray-50 dark:hover:bg-[#222] duration-150'>
                                {showIndex && (
                                    <td className='px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-200'>
                                        {rowIdx + 1}
                                    </td>
                                )}

                                {columns.map((col) => {
                                    return (
                                        <td
                                            key={col.key ?? rowIdx}
                                            className={`px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-200 ${
                                                col.className ?? ""
                                            }`}>
                                            {col.value
                                                ? col.value(item)
                                                : item[col.key]}
                                        </td>
                                    );
                                })}

                                {isSuperAdmin && actions && (
                                    <motion.td
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className='px-4 py-3 text-right'>
                                        <div className='inline-flex items-center gap-2'>
                                            {actions.includes("edit") && (
                                                <button
                                                    type='button'
                                                    onClick={() => onEdit(item)}
                                                    className='px-2.5 py-1.5 border border-blue-600 bg-blue-600/80 active:bg-blue-600 hover:bg-blue-600 rounded-lg transition active:scale-95 dark:bg-blue-600/40'>
                                                    {editIcon}
                                                </button>
                                            )}

                                            {actions.includes("delete") && (
                                                <button
                                                    type='button'
                                                    onClick={() =>
                                                        onDelete(item)
                                                    }
                                                    className='px-2.5 py-1.5 border border-red-600 bg-red-600/80 active:bg-red-600 hover:bg-red-600 rounded-lg transition active:scale-95 dark:bg-red-600/40'>
                                                    {deleteIcon}
                                                </button>
                                            )}
                                        </div>
                                    </motion.td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
