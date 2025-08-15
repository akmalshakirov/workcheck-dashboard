// File: CustomTable.jsx
import React from "react";
import { Loader2Icon } from "lucide-react";

export const CustomTable = ({
    data,
    columns,
    loading = false,
    emptyMessage = "Ma'lumotlar topilmadi",
    onEdit,
    onDelete,
    showHeader = true,
    className = "",
}) => {
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
            {loading && (
                <div className='py-4 flex justify-center'>
                    <Loader2Icon className='w-6 h-6 animate-spin text-gray-500 dark:text-gray-300' />
                </div>
            )}

            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                {showHeader && (
                    <thead className='bg-white dark:bg-gray-800'>
                        <tr>
                            {columns?.map((col, idx) => (
                                <th
                                    key={col.key ?? idx}
                                    scope='col'
                                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 ${
                                        col.width ?? ""
                                    } ${col.className ?? ""}`}>
                                    {col.header}
                                </th>
                            ))}

                            {(onEdit || onDelete) && (
                                <th className='px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                )}

                <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800'>
                    {data &&
                        data.map((item, idx) => (
                            <tr
                                key={(item && item.id) ?? idx}
                                className='hover:bg-gray-50 dark:hover:bg-gray-800'>
                                {columns.map((col) => {
                                    // prepare cell content (shunchaki funktsiyani qaytarmaymiz, balki natijani hisoblab beradi)
                                    let cellContent = null;
                                    if (col.render) {
                                        cellContent = col.render(item);
                                    } else {
                                        const value = item
                                            ? item[col.key]
                                            : undefined;
                                        if (
                                            col.key &&
                                            String(col.key).toLowerCase() ===
                                                "image" &&
                                            value
                                        ) {
                                            cellContent = (
                                                <img
                                                    src={value}
                                                    alt={String(
                                                        (item &&
                                                            (item.name ||
                                                                item.username)) ||
                                                            "avatar"
                                                    )}
                                                    className='w-10 h-10 rounded-md object-cover'
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><rect width='100%' height='100%' fill='%23E5E7EB'/></svg>";
                                                    }}
                                                />
                                            );
                                        } else if (
                                            value === null ||
                                            value === undefined
                                        ) {
                                            cellContent = (
                                                <span className='text-gray-400 dark:text-gray-500'>
                                                    -
                                                </span>
                                            );
                                        } else if (typeof value === "object") {
                                            cellContent = (
                                                <pre className='whitespace-normal text-xs'>
                                                    {JSON.stringify(value)}
                                                </pre>
                                            );
                                        } else {
                                            cellContent = (
                                                <span>{String(value)}</span>
                                            );
                                        }
                                    }

                                    return (
                                        <td
                                            key={col.key ?? idx}
                                            className={`px-4 py-3 align-middle text-sm text-gray-700 dark:text-gray-200 ${
                                                col.className ?? ""
                                            }`}>
                                            {cellContent}
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
                                                    className='px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none'>
                                                    Edit
                                                </button>
                                            )}

                                            {onDelete && (
                                                <button
                                                    type='button'
                                                    onClick={() =>
                                                        onDelete(item)
                                                    }
                                                    className='px-3 py-1.5 rounded-md border border-red-200 dark:border-red-700 text-sm bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400 focus:outline-none'>
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};
