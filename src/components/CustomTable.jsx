import { motion } from "framer-motion";
import { t } from "i18next";
import { useAdmin } from "../hooks/useAdmin";
import { Button } from "./ui/Button/Button";

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
            <div className='py-6 text-center text-lg text-gray-600 dark:text-gray-300 w-full'>
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
                                                <Button
                                                    type='button'
                                                    onClick={() =>
                                                        onEdit(item)
                                                    }>
                                                    {editIcon}
                                                </Button>
                                            )}

                                            {actions.includes("delete") && (
                                                <Button
                                                    type='button'
                                                    onClick={() =>
                                                        onDelete(item)
                                                    }
                                                    variant='danger'>
                                                    {deleteIcon}
                                                </Button>
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
