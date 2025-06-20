import { createContext, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import Ripple from "../Ripple/Ripple";

const SidearContext = createContext();

export const Sidebar = ({ children, collapsed }) => {
    return (
        <aside className={`${styles.sidebar}`}>
            <nav className='h-full flex flex-col bg-white dark:bg-black/90 dark:text-white rounded-lg shadow-sm dark:duration-400'>
                <Link
                    to={"/"}
                    className='p-4 pb-2 flex justify-center items-center'>
                    <span className='overflow-hidden transition-all duration-300 text-2xl font-bold mx-auto'>
                        {collapsed ? "WorkCheck" : "W"}
                    </span>
                </Link>

                <SidearContext.Provider value={{ collapsed }}>
                    <div className='flex-1 px-3 '>{children}</div>
                </SidearContext.Provider>
            </nav>
        </aside>
    );
};

export const SidebarItem = ({ icon, text, link }) => {
    const { collapsed } = useContext(SidearContext);
    return (
        <NavLink
            to={link}
            className={({ isActive }) =>
                `relative flex items-center rounded-lg whitespace-nowrap my-1 font-medium cursor-pointer transition-all group ${
                    isActive
                        ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 rounded-lg text-indigo-800 dark:bg-gradient-to-tl dark:from-gray-300 dark:to-gray-400/90"
                        : "hover:bg-indigo-50 text-gray-600 dark:hover:bg-gray-900 dark:text-white/70"
                }`
            }>
            {({ isActive }) => (
                <Ripple className='py-2.5 px-3 overflow-hidden rounded-lg'>
                    <>
                        <span
                            className={`${isActive ? "scale-120" : ""} ${
                                collapsed ? "mr-2" : "mr-0"
                            }`}>
                            {icon}
                        </span>
                        <span
                            className={`overflow-hidden transition-all ${
                                collapsed ? "" : "w-0"
                            }`}>
                            {text}
                        </span>
                        {!collapsed ? (
                            <div
                                className={`whitespace-nowrap absolute left-full z-[9999999] invisible opacity-20 -translate-x-3 transition-all duration-100 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 `}>
                                <span className='ml-2 p-2 bg-gradient-to-tl from-blue-400 to-indigo-600 text-white text-sm rounded-lg dark:to-black/80 dark:from-black/80'>
                                    {text}
                                </span>
                            </div>
                        ) : null}
                    </>
                </Ripple>
            )}
        </NavLink>
    );
};
