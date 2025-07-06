import {
    Bell,
    Globe,
    LockKeyhole,
    LogOut,
    Maximize,
    Menu,
    Minimize2,
    Moon,
    Sun,
    User,
    UserPen,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DropdowIcon from "../Icons/Dropdown";
import styles from "./Header.module.css";

function useClickOutside(ref, handler) {
    useEffect(() => {
        function handleClick(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                handler();
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [ref, handler]);
}

export const Header = ({ collapsed, setCollapsed, message }) => {
    const [langOpen, setLangOpen] = useState(false);
    const [langClosing, setLangClosing] = useState(false);
    const [selectedLang, setSelectedLang] = useState({
        code: "uz",
        label: "Uz",
    });
    const { i18n } = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifClosing, setNotifClosing] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [profileClosing, setProfileClosing] = useState(false);
    const [isDark, setIsDark] = useState(
        localStorage.getItem("isDark") == "true"
    );
    const [isFull, setIsFull] = useState(false);
    const langRef = useRef();
    const notifRef = useRef();
    const profileRef = useRef();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const closeDropdown = (open, setOpen, setClosing) => {
        if (open) {
            setClosing(true);
            setTimeout(() => {
                setClosing(false);
                setOpen(false);
            }, 250);
        }
    };

    const toggleDropdown = (open, setOpen, setClosing) => {
        if (open) {
            closeDropdown(open, setOpen, setClosing);
        } else {
            setOpen(true);
        }
    };

    useClickOutside(langRef, () =>
        closeDropdown(langOpen, setLangOpen, setLangClosing)
    );
    useClickOutside(notifRef, () =>
        closeDropdown(notifOpen, setNotifOpen, setNotifClosing)
    );
    useClickOutside(profileRef, () =>
        closeDropdown(profileOpen, setProfileOpen, setProfileClosing)
    );

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
        localStorage.setItem("isDark", isDark);
    }, [isDark]);

    useEffect(() => {
        function onFullChange() {
            setIsFull(!!document.fullscreenElement);
        }
        document.addEventListener("fullscreenchange", onFullChange);
        return () =>
            document.removeEventListener("fullscreenchange", onFullChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    const languages = [
        { code: "en", label: "En" },
        { code: "uz", label: "Uz" },
        { code: "ru", label: "Ru" },
    ];
    const notifications = [
        { id: 1, text: "Sizga yangi xabar keldi" },
        { id: 2, text: "Hisobot tayyor" },
        { id: 3, text: "Yangi foydalanuvchi ro‘yxatdan o‘tdi" },
    ];
    const profileActions = [
        {
            id: "profile",
            label: t("dropdown_profile"),
            onClick: () => navigate("/profile"),
            icon: <UserPen size={20} />,
        },
        {
            id: "lockscreen",
            label: t("dropdown_lockscreen"),
            onClick: () => alert("Lock screen"),
            icon: <LockKeyhole size={20} />,
        },
        {
            id: "logout",
            label: t("dropdown_logout"),
            onClick: () => handleLogout(),
            icon: <LogOut size={20} />,
        },
    ];

    return (
        <div className='p-2.5 flex-1 flex items-center justify-between max-h-max bg-white rounded-lg !w-full dark:bg-[#111] dark:text-white sticky top-2.5 z-[1] shadow-sm'>
            <div className='flex gap-2.5'>
                <button
                    onClick={() => {
                        setCollapsed(!collapsed);
                    }}
                    className='p-1 hover:bg-gray-700/30 border border-gray-700 rounded-lg duration-200 active:scale-[0.95]'
                    title={!collapsed ? t("open_sidebar") : t("close_sidebar")}
                    aria-label={
                        !collapsed ? t("open_sidebar") : t("close_sidebar")
                    }>
                    {collapsed ? <Menu size={22} /> : <X size={22} />}
                </button>
                <div>
                    <input
                        type='text'
                        className='px-2 py-1 border border-gray-700 rounded-lg outline-none focus:bg-gray-800/10 transition-colors placeholder-black/30 dark:placeholder-white/30 dark:focus:bg-gray-600/40'
                        placeholder={`${t("search")}...`}
                        name='search'
                        id='search'
                    />
                </div>
            </div>
            {/* right side */}
            <div className='flex items-center gap-2.5'>
                <div
                    ref={langRef}
                    className={`${styles.item} dark:text-white border dark:border-white/40 border-black/30 rounded-lg`}
                    onClick={() =>
                        toggleDropdown(langOpen, setLangOpen, setLangClosing)
                    }>
                    <div className='flex items-center justify-center pl-2 py-2 px-1 duration-200 active:scale-[0.95] will-change-transform'>
                        <Globe className='mr-1' size={22} />
                        {selectedLang.label}
                        <span
                            className={`dark:fill-white duration-200 ml-1 ${
                                langOpen ? "rotate-180" : ""
                            }`}>
                            <DropdowIcon />
                        </span>
                    </div>
                    {(langOpen || langClosing) && (
                        <ul
                            className={`${styles.dropdown} ${
                                langClosing
                                    ? styles.dropdownExit
                                    : styles.dropdownEnter
                            } dark:text-white bg-white/70 backdrop-blur-xs p-1 dark:bg-black/70`}>
                            {languages.map((lang) => (
                                <li
                                    key={lang.code}
                                    onClick={() => {
                                        setSelectedLang(lang);
                                        closeDropdown(
                                            true,
                                            setLangOpen,
                                            setLangClosing
                                        );
                                        changeLanguage(lang.code);
                                    }}
                                    className='dark:hover:bg-white/20 px-6! rounded-lg hover:bg-black/10'>
                                    {lang.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button
                    onClick={toggleFullscreen}
                    aria-label='Toggle Fullscreen'
                    title='Toggle Fullscreen'
                    className='border border-black/30 dark:border-white/40 rounded-lg'>
                    <span className='p-2.5 duration-200 active:scale-[0.85] will-change-transform block'>
                        {isFull ? (
                            <Minimize2 size={20} />
                        ) : (
                            <Maximize size={20} />
                        )}
                    </span>
                </button>

                <div
                    ref={notifRef}
                    className={styles.item}
                    onClick={() =>
                        toggleDropdown(notifOpen, setNotifOpen, setNotifClosing)
                    }>
                    <div className='border dark:border-white/40 border-black/30 rounded-lg'>
                        <span className='flex items-center justify-center duration-200 active:scale-[0.95] will-change-transform p-1 pl-2 py-2'>
                            <span className='relative'>
                                <Bell size={22} className='mr-1' />
                                <span className='absolute -top-1.5 -right-[3px] bg-red-500 text-white rounded-full'>
                                    <span className='block text-[12px] px-[5.5px] animate-ping'>
                                        {notifications.length}
                                    </span>
                                </span>
                            </span>
                            <span
                                className={`dark:fill-white duration-200 ml-1 ${
                                    notifOpen ? "rotate-180" : ""
                                }`}>
                                <DropdowIcon />
                            </span>
                        </span>
                    </div>
                    {(notifOpen || notifClosing) && (
                        <ul
                            className={`${styles.dropdown} ${styles.notif} ${
                                notifClosing
                                    ? styles.dropdownExit
                                    : styles.dropdownEnter
                            } dark:bg-black/70 bg-white/70 backdrop-blur-xs`}>
                            {notifications.map((n) => (
                                <li
                                    key={n.id}
                                    className='dark:hover:bg-white/20 hover:bg-black/10'>
                                    {n.text}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <label
                    htmlFor='switch'
                    className='border cursor-pointer dark:border-white/40 border-black/30 p-1 py-2 rounded-lg'>
                    <div className={styles.switch}>
                        <input
                            id='switch'
                            type='checkbox'
                            checked={isDark}
                            onChange={() => setIsDark((d) => !d)}
                        />
                        <span className={styles.slider}>
                            <span className='rounded-full'>
                                {isDark ? (
                                    <Sun size={20} />
                                ) : (
                                    <Moon size={20} />
                                )}
                            </span>
                        </span>
                    </div>
                </label>

                <div
                    ref={profileRef}
                    className={styles.item}
                    onClick={() =>
                        toggleDropdown(
                            profileOpen,
                            setProfileOpen,
                            setProfileClosing
                        )
                    }>
                    <div className='border dark:border-white/40 border-black/30 rounded-lg '>
                        <div className='flex items-center justify-center p-1 pl-2.5 py-2 duration-200 active:scale-[0.95] will-change-transform'>
                            <User />
                            <span
                                className={`dark:fill-white duration-200 ml-1 ${
                                    profileOpen ? "rotate-180" : ""
                                }`}>
                                <DropdowIcon />
                            </span>
                        </div>
                    </div>
                    {(profileOpen || profileClosing) && (
                        <ul
                            className={`${styles.dropdown} ${
                                profileClosing
                                    ? styles.dropdownExit
                                    : styles.dropdownEnter
                            } bg-white/70 backdrop-blur-xs whitespace-nowrap dark:bg-black/70 dark:text-white p-1`}>
                            {profileActions.map((a) => (
                                <li
                                    key={a.id}
                                    onClick={a.onClick}
                                    className='flex items-center gap-2 dark:hover:bg-white/20 rounded-lg hover:bg-black/10'>
                                    {a.icon}
                                    {a.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {/* right side closed */}
            </div>
        </div>
    );
};
