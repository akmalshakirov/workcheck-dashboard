import { motion } from "framer-motion";
import { createContext, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import Ripple from "../Ripple/Ripple";

const SidearContext = createContext();

export const Sidebar = ({ children, collapsed }) => {
    return (
        <motion.div
            initial={collapsed ? { width: "5.8rem" } : { width: "14.3rem" }}
            animate={collapsed ? { width: "5.8rem" } : { width: "14.3rem" }}
            transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 400,
                damping: 30,
            }}>
            <aside
                className='p-2.5 h-screen sticky top-0 z-1 duration-200'
                aria-atomic='false'>
                <nav
                    className={`h-full flex flex-col bg-white dark:bg-[#111] dark:text-white rounded-lg shadow-sm duration-200`}>
                    <Link
                        to={"/"}
                        className='p-4 pb-2 flex justify-center items-center overflow-hidden relative border-b border-b-gray-500/40 mb-2'>
                        <span className={`text-2xl font-bold mx-auto`}>
                            {!collapsed ? "WorkCheck" : "W"}
                        </span>
                    </Link>

                    <SidearContext.Provider value={{ collapsed }}>
                        <div className='flex-1 px-3'>{children}</div>
                    </SidearContext.Provider>
                </nav>
            </aside>
        </motion.div>
    );
};

export const SidebarItem = ({ icon, text, link }) => {
    const { collapsed } = useContext(SidearContext);
    return (
        <NavLink
            to={link}
            className={({ isActive }) =>
                `relative flex items-center rounded-lg whitespace-nowrap my-1 font-medium cursor-pointer transition-all group z-[999999999] ${
                    isActive
                        ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 rounded-lg text-indigo-800 dark:bg-gradient-to-tl dark:from-[#333] dark:to-[#333] dark:text-white"
                        : "hover:bg-indigo-50 text-gray-600 dark:hover:bg-white/10 dark:text-white/70"
                }`
            }>
            {({ isActive }) => (
                <>
                    <Ripple className='py-2.5 px-3 relative rounded-lg z-[999999]'>
                        <>
                            <span
                                className={`${isActive ? "scale-120" : ""} ${
                                    !collapsed ? "mr-2" : "mr-0"
                                }`}>
                                {icon}
                            </span>
                            <span
                                className={`overflow-hidden transition-all ${
                                    !collapsed ? "" : "w-0"
                                }`}>
                                {text}
                            </span>
                        </>
                    </Ripple>
                    <span className='relative w-auto'>
                        {collapsed && (
                            <div
                                className={`whitespace-nowrap absolute z-[999]! -top-3 left-full opacity-20 -translate-x-3 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 invisible`}>
                                <span className='ml-2 p-2 bg-gradient-to-tl from-blue-400 to-indigo-600 text-white text-sm rounded-lg dark:to-black/80 dark:from-black/80'>
                                    {text}
                                </span>
                            </div>
                        )}
                    </span>
                </>
            )}
        </NavLink>
    );
};
