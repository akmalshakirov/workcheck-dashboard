import { useState } from "react";
import { Sidebar } from "./components/Sidebar/Sidebar";

const App = () => {
    const [activeItem, setActiveItem] = useState("dashboard");

    const renderContent = () => {
        switch (activeItem) {
            case "dashboard":
                return (
                    <div className='p-8'>
                        <h1 className='text-3xl font-bold text-gray-800 mb-4'>
                            Dashboard
                        </h1>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <div className='bg-blue-500 text-white p-6 rounded-lg'>
                                <h3 className='text-lg font-semibold'>
                                    Total Users
                                </h3>
                                <p className='text-3xl font-bold'>1,234</p>
                            </div>
                            <div className='bg-green-500 text-white p-6 rounded-lg'>
                                <h3 className='text-lg font-semibold'>
                                    Revenue
                                </h3>
                                <p className='text-3xl font-bold'>$45,678</p>
                            </div>
                            <div className='bg-purple-500 text-white p-6 rounded-lg'>
                                <h3 className='text-lg font-semibold'>
                                    Orders
                                </h3>
                                <p className='text-3xl font-bold'>892</p>
                            </div>
                        </div>
                    </div>
                );
            case "analytics":
                return (
                    <div className='p-8'>
                        <h1 className='text-3xl font-bold text-gray-800 mb-4'>
                            Analytics
                        </h1>
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <p className='text-gray-600 mb-4'>
                                Analytics va statistikalar bu yerda
                                ko'rsatiladi.
                            </p>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='bg-gray-100 p-4 rounded'>
                                    <h4 className='font-semibold'>
                                        Kunlik ko'rishlar
                                    </h4>
                                    <p className='text-2xl font-bold text-blue-600'>
                                        2,547
                                    </p>
                                </div>
                                <div className='bg-gray-100 p-4 rounded'>
                                    <h4 className='font-semibold'>
                                        Haftalik o'sish
                                    </h4>
                                    <p className='text-2xl font-bold text-green-600'>
                                        +12.5%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "users":
                return (
                    <div className='p-8'>
                        <h1 className='text-3xl font-bold text-gray-800 mb-4'>
                            Foydalanuvchilar
                        </h1>
                        <div className='bg-white rounded-lg shadow-md'>
                            <div className='p-6 border-b'>
                                <p className='text-gray-600'>
                                    Foydalanuvchilar ro'yxati va boshqaruv.
                                </p>
                            </div>
                            <div className='p-6'>
                                <table className='w-full'>
                                    <thead>
                                        <tr className='border-b'>
                                            <th className='text-left py-2'>
                                                Ism
                                            </th>
                                            <th className='text-left py-2'>
                                                Email
                                            </th>
                                            <th className='text-left py-2'>
                                                Rol
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className='border-b'>
                                            <td className='py-2'>John Doe</td>
                                            <td className='py-2'>
                                                john@example.com
                                            </td>
                                            <td className='py-2'>Admin</td>
                                        </tr>
                                        <tr className='border-b'>
                                            <td className='py-2'>Jane Smith</td>
                                            <td className='py-2'>
                                                jane@example.com
                                            </td>
                                            <td className='py-2'>User</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
                return (
                    <div className='p-8'>
                        <h1 className='text-3xl font-bold text-gray-800 mb-4'>
                            Hisobotlar
                        </h1>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='bg-white p-6 rounded-lg shadow-md'>
                                <h3 className='text-lg font-semibold mb-4'>
                                    Oylik hisobot
                                </h3>
                                <div className='space-y-3'>
                                    <div className='flex justify-between'>
                                        <span>Jami sotuvlar:</span>
                                        <span className='font-semibold'>
                                            $12,450
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>Yangi mijozlar:</span>
                                        <span className='font-semibold'>
                                            124
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>Conversion rate:</span>
                                        <span className='font-semibold'>
                                            3.2%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-white p-6 rounded-lg shadow-md'>
                                <h3 className='text-lg font-semibold mb-4'>
                                    Performance
                                </h3>
                                <div className='space-y-3'>
                                    <div>
                                        <div className='flex justify-between mb-1'>
                                            <span>Server uptime</span>
                                            <span>99.9%</span>
                                        </div>
                                        <div className='w-full bg-gray-200 rounded-full h-2'>
                                            <div
                                                className='bg-green-600 h-2 rounded-full'
                                                style={{ width: "99%" }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='flex justify-between mb-1'>
                                            <span>Response time</span>
                                            <span>245ms</span>
                                        </div>
                                        <div className='w-full bg-gray-200 rounded-full h-2'>
                                            <div
                                                className='bg-yellow-600 h-2 rounded-full'
                                                style={{ width: "75%" }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "settings":
                return (
                    <div className='p-8'>
                        <h1 className='text-3xl font-bold text-gray-800 mb-4'>
                            Sozlamalar
                        </h1>
                        <div className='bg-white rounded-lg shadow-md'>
                            <div className='p-6 space-y-6'>
                                <div>
                                    <h3 className='text-lg font-semibold mb-4'>
                                        Profil sozlamalari
                                    </h3>
                                    <div className='space-y-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                Ism
                                            </label>
                                            <input
                                                type='text'
                                                className='w-full p-2 border border-gray-300 rounded-md'
                                                defaultValue='Admin User'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                Email
                                            </label>
                                            <input
                                                type='email'
                                                className='w-full p-2 border border-gray-300 rounded-md'
                                                defaultValue='admin@example.com'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='border-t pt-6'>
                                    <h3 className='text-lg font-semibold mb-4'>
                                        Bildirishnoma sozlamalari
                                    </h3>
                                    <div className='space-y-3'>
                                        <label className='flex items-center'>
                                            <input
                                                type='checkbox'
                                                className='mr-2'
                                                defaultChecked
                                            />
                                            Email bildirishnomalar
                                        </label>
                                        <label className='flex items-center'>
                                            <input
                                                type='checkbox'
                                                className='mr-2'
                                            />
                                            SMS bildirishnomalar
                                        </label>
                                        <label className='flex items-center'>
                                            <input
                                                type='checkbox'
                                                className='mr-2'
                                                defaultChecked
                                            />
                                            Push bildirishnomalar
                                        </label>
                                    </div>
                                </div>
                                <div className='border-t pt-6'>
                                    <button className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'>
                                        O'zgarishlarni saqlash
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className='p-8'>
                        <h1 className='text-3xl font-bold text-gray-800 mb-4'>
                            Dashboard
                        </h1>
                        <p className='text-gray-600'>
                            Dashboard content bu yerda ko'rsatiladi.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className='flex min-h-screen max-w-screen w-full bg-gray-100'>
            <Sidebar setActiveItem={setActiveItem} />
            <main className='flex-1 overflow-auto'>{renderContent()}</main>
        </div>
    );
};

export default App;
