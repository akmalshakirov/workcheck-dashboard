import React, { useState } from "react";
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Edit2,
    Trash2,
} from "lucide-react";

const Table = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    // Sample data
    const [users] = useState([
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
            name: "Ali Karimov",
            username: "@alikarimov",
            role: "Admin",
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
            name: "Madina Tosheva",
            username: "@madina_t",
            role: "Moderator",
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
            name: "Bobur Azimov",
            username: "@bobur_dev",
            role: "User",
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
            name: "Nilufar Rahimova",
            username: "@nilufar_r",
            role: "Editor",
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
            name: "Sardor Mahmudov",
            username: "@sardor_m",
            role: "User",
        },
        {
            id: 6,
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
            name: "Feruza Nazarova",
            username: "@feruza_n",
            role: "Admin",
        },
        {
            id: 221,
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
            name: "Ali Karimov",
            username: "@alikarimov",
            role: "Admin",
        },
        {
            id: 622,
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
            name: "Madina Tosheva",
            username: "@madina_t",
            role: "Moderator",
        },
        {
            id: 8353,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
            name: "Bobur Azimov",
            username: "@bobur_dev",
            role: "User",
        },
        {
            id: 434,
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
            name: "Nilufar Rahimova",
            username: "@nilufar_r",
            role: "Editor",
        },
        {
            id: 8455,
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
            name: "Sardor Mahmudov",
            username: "@sardor_m",
            role: "User",
        },
        {
            id: 62315,
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
            name: "Feruza Nazarova",
            username: "@feruza_n",
            role: "Admin",
        },
    ]);

    const filteredUsers = users
        .filter(
            (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.username
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const aValue = a[sortBy].toLowerCase();
            const bValue = b[sortBy].toLowerCase();
            if (sortOrder === "asc") {
                return aValue.localeCompare(bValue);
            }
            return bValue.localeCompare(aValue);
        });

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role.toLowerCase()) {
            case "admin":
                return "bg-red-100 text-red-800 border-red-200";
            case "moderator":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "editor":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className='p-4 rounded-lg overflow-x-hidden'>
            <div className='max-w-6xl mx-auto'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-slate-800 mb-2'>
                        Adminlar
                    </h1>
                </div>

                <div className='bg-white rounded-xl shadow-sm border border-slate-200'>
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-slate-50 border-b border-slate-200'>
                                <tr>
                                    <th className='text-left py-4 px-6 font-semibold text-slate-700'>
                                        <button
                                            onClick={() => handleSort("name")}
                                            className='flex items-center gap-2 hover:text-blue-600 transition-colors'>
                                            Foydalanuvchi
                                            {sortBy === "name" && (
                                                <span className='text-xs'>
                                                    {sortOrder === "asc"
                                                        ? "↑"
                                                        : "↓"}
                                                </span>
                                            )}
                                        </button>
                                    </th>
                                    <th className='text-left py-4 px-6 font-semibold text-slate-700'>
                                        <button
                                            onClick={() =>
                                                handleSort("username")
                                            }
                                            className='flex items-center gap-2 hover:text-blue-600 transition-colors'>
                                            Username
                                            {sortBy === "username" && (
                                                <span className='text-xs'>
                                                    {sortOrder === "asc"
                                                        ? "↑"
                                                        : "↓"}
                                                </span>
                                            )}
                                        </button>
                                    </th>
                                    <th className='text-left py-4 px-6 font-semibold text-slate-700'>
                                        <button
                                            onClick={() => handleSort("role")}
                                            className='flex items-center gap-2 hover:text-blue-600 transition-colors'>
                                            Role
                                            {sortBy === "role" && (
                                                <span className='text-xs'>
                                                    {sortOrder === "asc"
                                                        ? "↑"
                                                        : "↓"}
                                                </span>
                                            )}
                                        </button>
                                    </th>
                                    <th className='text-right py-4 px-6 font-semibold text-slate-700'>
                                        Amallar
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-slate-100'>
                                {filteredUsers.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className='hover:bg-slate-50 transition-colors group'>
                                        <td className='py-4 px-6'>
                                            <div className='flex items-center gap-3'>
                                                <div className='relative'>
                                                    <img
                                                        src={user.image}
                                                        alt={user.name}
                                                        className='w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm'
                                                    />
                                                    <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white'></div>
                                                </div>
                                                <div>
                                                    <div className='font-medium text-slate-800'>
                                                        {user.name}
                                                    </div>
                                                    <div className='text-sm text-slate-500'>
                                                        ID: {user.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-4 px-6'>
                                            <span className='text-slate-600 font-mono text-sm'>
                                                {user.username}
                                            </span>
                                        </td>
                                        <td className='py-4 px-6'>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                                                    user.role
                                                )}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className='py-4 px-6 text-right'>
                                            <div className='flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                                                <button className='p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'>
                                                    <Eye className='w-4 h-4' />
                                                </button>
                                                <button className='p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors'>
                                                    <Edit2 className='w-4 h-4' />
                                                </button>
                                                <button className='p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'>
                                                    <Trash2 className='w-4 h-4' />
                                                </button>
                                                <button className='p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors'>
                                                    <MoreHorizontal className='w-4 h-4' />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className='bg-slate-50 px-6 py-4 border-t border-slate-200'>
                        <div className='flex items-center justify-between text-sm text-slate-600'>
                            <span>
                                Jami {filteredUsers.length} ta foydalanuvchi
                            </span>
                            <div className='flex items-center gap-2'>
                                <button className='px-3 py-1 border border-slate-300 rounded hover:bg-white transition-colors'>
                                    Avvalgi
                                </button>
                                <span className='px-3 py-1 bg-blue-600 text-white rounded'>
                                    1
                                </span>
                                <button className='px-3 py-1 border border-slate-300 rounded hover:bg-white transition-colors'>
                                    Keyingi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;
