import { createContext, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const SidearContext = createContext();

export const Sidebar = ({ children, collapsed }) => {
    return (
        <aside className={`${styles.sidebar}`}>
            <nav className='h-full flex flex-col bg-white rounded-lg shadow-sm'>
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
                `relative flex items-center py-2.5 px-3 whitespace-nowrap my-1 font-medium rounded-lg cursor-pointer transition-all group ${
                    isActive
                        ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
                        : "hover:bg-indigo-50 text-gray-600"
                }`
            }>
            {({ isActive }) => (
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
                            className={`whitespace-nowrap absolute left-full rounded-lg p-2 ml-1.5 bg-gradient-to-tl from-blue-400 to-indigo-600 text-white text-sm invisible opacity-20 -translate-x-3 transition-all duration-100 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                            {text}
                        </div>
                    ) : null}
                </>
            )}
        </NavLink>
    );
};
