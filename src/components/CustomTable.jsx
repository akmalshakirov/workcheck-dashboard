import { useTranslation } from "react-i18next";

export function CustomTable({
    data,
    columns = [],
    loading = false,
    emptyMessage = "Ma'lumotlar topilmadi",
    onEdit,
    onDelete,
    showHeader = true,
    className = "",
    deleteIcon,
    editIcon,
    showIndex = false,
}) {
    const { t } = useTranslation();

    const isEmpty = !data || data.length === 0;

    if (isEmpty && !loading) {
        return (
            <div className='py-6 text-center text-sm text-gray-600 dark:text-gray-300'>
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={className}>
            <table className='min-w-full overflow-x-scroll lg:overflow-auto'>
                {showHeader && (
                    <thead className='bg-white dark:bg-[#222]'>
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

                            {(onEdit || onDelete) && (
                                <th className='px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                                    {t("admin_table_action")}
                                </th>
                            )}
                        </tr>
                    </thead>
                )}

                <tbody className='bg-white dark:bg-[#111] divide-y divide-gray-100 dark:divide-gray-800'>
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

                                {(onEdit || onDelete) && (
                                    <td className='px-4 py-3 text-right'>
                                        <div className='inline-flex items-center gap-2'>
                                            {onEdit && (
                                                <button
                                                    type='button'
                                                    onClick={() => onEdit(item)}
                                                    className='px-2.5 py-1.5 border border-blue-600 bg-blue-600/80 active:bg-blue-600 hover:bg-blue-600 rounded-lg transition active:scale-95 dark:bg-blue-600/40'>
                                                    {editIcon
                                                        ? editIcon
                                                        : "Edit"}
                                                </button>
                                            )}

                                            {onDelete && (
                                                <button
                                                    type='button'
                                                    onClick={() =>
                                                        onDelete(item)
                                                    }
                                                    className='px-2.5 py-1.5 border border-red-600 bg-red-600/80 active:bg-red-600 hover:bg-red-600 rounded-lg transition active:scale-95 dark:bg-red-600/40'>
                                                    {deleteIcon
                                                        ? deleteIcon
                                                        : "Delete"}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
