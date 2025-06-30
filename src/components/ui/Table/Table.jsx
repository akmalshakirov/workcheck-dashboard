import React from "react";

function Table({ data }) {
    return (
        <div className='overflow-x-auto bg-white dark:bg-[#222] rounded-lg shadow'>
            <table className='min-w-full divide-y divide-gray-200 dark:bg-black'>
                <thead className='bg-gray-50 dark:bg-[#222]'>
                    <tr>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                            Image
                        </th>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                            Name
                        </th>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                            Username
                        </th>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                            Role
                        </th>
                        <th
                            scope='col'
                            className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'></th>
                    </tr>
                </thead>
                <tbody className='bg-white dark:bg-[#111010] divide-y divide-gray-200 dark:divide-gray-700'>
                    {data.map((item) => (
                        <tr
                            key={item.id}
                            className='hover:bg-gray-100 dark:hover:bg-[#222] transition-colors'>
                            {/* <td className='px-6 py-4 whitespace-nowrap'>
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className='h-10 w-10 rounded-full object-cover'
                                />
                            </td> */}
                            <td></td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                                    {item.name}
                                </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-500 dark:text-gray-400'>
                                    {item.username}
                                </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-200 text-green-800 dark:text-green-900'>
                                    {item.role}
                                </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2'>
                                <button
                                    onClick={() => console.log("Edit", item.id)}
                                    className='px-3 py-1 border border-blue-500 text-blue-500 dark:text-blue-400 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition'>
                                    O'zgartirish
                                </button>
                                <button
                                    onClick={() =>
                                        console.log("Delete", item.id)
                                    }
                                    className='px-3 py-1 border border-red-500 text-red-500 dark:text-red-400 dark:border-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition'>
                                    O'chirish
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default Table;
