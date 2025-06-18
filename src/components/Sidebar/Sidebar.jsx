import { motion } from "framer-motion";
import { useState } from "react";
import { FiUsers } from "react-icons/fi";
import { LiaUserEditSolid } from "react-icons/lia";
import { MdDashboard } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import {
    TbLayoutSidebarLeftCollapse,
    TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import { Link, NavLink } from "react-router-dom";

const menuItems = [
    {
        label: "Bosh sahifa",
        icon: <MdDashboard size={20} />,
        href: "/",
        to: "dashboard",
    },
    {
        label: "Adminlar",
        icon: <RiAdminLine size={20} />,
        // BsPersonWorkspace
        href: "/admins",
        to: "users",
    },
    {
        label: "Ishchilar",
        icon: <FiUsers size={20} />,
        href: "/workers",
        to: "analytics",
    },
    {
        label: "Mening profilim",
        icon: <LiaUserEditSolid size={20} />,
        href: "/profile",
        to: "settings",
    },
];

export const Sidebar = ({ setActiveItem, toggleSidebar, isCollapsed }) => {
    const [collapsed, setCollapsed] = useState(false);

    const sidebarVariants = {
        expanded: {
            width: 250,
            transition: { type: "easyInOut", duration: 0.2 },
        },
        collapsed: {
            width: 64,
            transition: { type: "spring", duration: 0.7 },
        },
    };

    return (
        <motion.div
            className='flex flex-col bg-gray-800 text-gray-100 h-screen overflow-hidden'
            variants={sidebarVariants}
            animate={collapsed ? "collapsed" : "expanded"}
            initial='expanded'>
            <div className='flex items-center justify-between px-4 py-3 border-b border-gray-700'>
                <Link
                    to={"/"}
                    onClick={() => setActiveItem("dashboard")}
                    className='text-lg font-bold'>
                    {collapsed ? "W" : "WorkCheck"}
                </Link>
                <button
                    onClick={() => {
                        setCollapsed(!collapsed);
                    }}
                    className='p-1 hover:bg-gray-700 rounded'
                    title={collapsed ? "Menyuni ochish" : "Menyuni yopish"}
                    aria-label={
                        collapsed ? "Menyuni ochish" : "Menyuni yopish"
                    }>
                    {collapsed ? (
                        <TbLayoutSidebarRightCollapse size={20} />
                    ) : (
                        <TbLayoutSidebarLeftCollapse size={20} />
                    )}
                </button>
            </div>

            <nav className='flex-1 px-2 py-4 relative z-[100]'>
                {menuItems.map((item, idx) => (
                    <NavLink
                        key={idx}
                        to={item.href}
                        onClick={() => setActiveItem(item.to)}>
                        <div
                            className={`group flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 relative ${({
                                isActive,
                            }) => (isActive ? "bg-amber-700" : "")}`}>
                            {item.icon}
                            {!collapsed ? (
                                <span className='whitespace-nowrap'>
                                    {item.label}
                                </span>
                            ) : (
                                <span className='absolute left-full ml-2 px-2 py-1 bg-gray-900 text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity group-hover:pointer-events-auto'>
                                    {item.label}
                                </span>
                            )}
                        </div>
                    </NavLink>
                ))}
            </nav>
        </motion.div>
    );
};
