import { AnimatePresence, motion } from "framer-motion";
import {
    Bell,
    BellRing,
    Globe,
    LockKeyhole,
    LogOut,
    Maximize,
    Menu,
    Minimize2,
    Moon,
    Sun,
    UserPen,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useClickOutside } from "../../../hooks/useClickOutside";
import DropdownIcon from "../Icons/Dropdown";
import styles from "./Header.module.css";
import { Skeleton } from "../Skeleton/Skeleton";

export const Header = ({ collapsed, setCollapsed, admin = {} }) => {
    const [langOpen, setLangOpen] = useState(false);
    const [langClosing, setLangClosing] = useState(false);
    const [selectedLang, setSelectedLang] = useState({
        code: localStorage.getItem("lang") || "uz",
        label: localStorage.getItem("lang") || "Uz",
    });
    const { i18n } = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("lang", lng);
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileLangOpen, setMobileLangOpen] = useState(false);
    const [mobileNotifOpen, setMobileNotifOpen] = useState(false);
    const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
    const lang = localStorage.getItem("lang");

    useEffect(() => {
        localStorage.setItem("lang", selectedLang.code);
    }, [langRef, selectedLang, lang]);

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
            <div className='flex gap-2.5 items-center'>
                {/* Burger button for mobile */}
                <button
                    className='md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none'
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label='Open menu'>
                    <Menu size={24} />
                </button>
                {/* Sidebar toggle (desktop only) */}
                <button
                    onClick={() => {
                        setCollapsed(!collapsed);
                    }}
                    className='p-1 hover:bg-gray-700/30 border border-gray-700 rounded-lg duration-200 active:scale-[0.95] hidden md:inline-flex'
                    title={!collapsed ? t("open_sidebar") : t("close_sidebar")}
                    aria-label={
                        !collapsed ? t("open_sidebar") : t("close_sidebar")
                    }>
                    {collapsed ? <Menu size={22} /> : <X size={22} />}
                </button>
                <div className='hidden md:block'>
                    <input
                        type='text'
                        className='px-2 py-1 border border-gray-700 rounded-lg outline-none focus:bg-gray-800/10 transition-colors placeholder-black/30 dark:placeholder-white/30 dark:focus:bg-gray-600/40'
                        placeholder={`${t("search")}...`}
                        name='search'
                        id='search'
                    />
                </div>
            </div>
            {/* right side nav (desktop) */}
            <div className='hidden md:flex items-center gap-2.5'>
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
                            <DropdownIcon />
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
                                {notifications.length > 0 ? (
                                    <BellRing size={22} className='mr-1' />
                                ) : (
                                    <Bell size={22} className='mr-1' />
                                )}
                                <span className='absolute -top-1.5 -right-[3px] bg-red-500 text-white rounded-full'>
                                    <span
                                        className='block text-[12px] px-[5.5px] animate-pulse'
                                        style={{
                                            animationDuration: "1s",
                                        }}>
                                        {notifications.length}
                                    </span>
                                </span>
                            </span>
                            <span
                                className={`dark:fill-white duration-200 ml-1 ${
                                    notifOpen ? "rotate-180" : ""
                                }`}>
                                <DropdownIcon />
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
                            {!admin ? (
                                <Skeleton className='size-6 rounded-full' />
                            ) : (
                                <img
                                    src={
                                        admin?.image
                                            ? admin?.image
                                            : "https://alyeowbccvspelnnwqhy.supabase.co/storage/v1/object/public/images//defaultImage.png"
                                    }
                                    alt='Admin-image'
                                    className='size-6 object-cover rounded-full'
                                />
                            )}
                            <span
                                className={`dark:fill-white duration-200 ml-1 ${
                                    profileOpen ? "rotate-180" : ""
                                }`}>
                                <DropdownIcon />
                            </span>
                        </div>
                    </div>
                    {(profileOpen || profileClosing) && (
                        <div
                            className={`${styles.dropdown} ${
                                profileClosing
                                    ? styles.dropdownExit
                                    : styles.dropdownEnter
                            } bg-white whitespace-nowrap dark:bg-[#222] dark:text-white p-1`}>
                            <div
                                className='border-b border-b-gray-600/80 mb-1 p-2 flex gap-2.5 cursor-default'
                                onClick={(e) => e.stopPropagation()}>
                                <div className='flex items-center gap-3'>
                                    <>
                                        {admin?.image ? (
                                            <img
                                                src={
                                                    admin?.image
                                                        ? admin?.image
                                                        : "https://alyeowbccvspelnnwqhy.supabase.co/storage/v1/object/public/images//defaultImage.png"
                                                }
                                                alt='Admin image'
                                                className='size-10 mt-1 object-cover rounded-full'
                                            />
                                        ) : (
                                            <Skeleton className='w-10 h-10 rounded-full' />
                                        )}
                                    </>
                                    <div className='flex flex-col max-w-max'>
                                        {admin?.name ? (
                                            <p className='uppercase whitespace-break-spaces ml-1 break-all line-clamp-1'>
                                                {admin.name}
                                            </p>
                                        ) : (
                                            <Skeleton className='w-[120px] h-[20px]' />
                                        )}
                                        {admin?.role ? (
                                            <p className='px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-200 text-green-800 dark:text-green-900'>
                                                {admin.role}
                                            </p>
                                        ) : (
                                            <Skeleton className='w-[120px] h-[20px] mt-2' />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <ul>
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
                        </div>
                    )}
                </div>
            </div>

            {/* it's mobile version of navbar */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                        className='fixed inset-0 z-50 bg-black/40 flex md:hidden'
                        onClick={() => setMobileMenuOpen(false)}>
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                            }}
                            className='bg-white dark:bg-[#111] p-4 flex flex-col gap-4 w-3/4 max-w-xs h-full shadow-lg'
                            onClick={(e) => e.stopPropagation()}>
                            <div className='flex justify-between items-center mb-4'>
                                <span className='font-bold text-lg'>Menu</span>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    aria-label='Close menu'>
                                    <X size={28} />
                                </button>
                            </div>

                            <div>
                                <button
                                    className='flex items-center w-full py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
                                    onClick={() =>
                                        setMobileLangOpen((v) => !v)
                                    }>
                                    <Globe className='mr-2' size={22} />
                                    {selectedLang.label}
                                    <span
                                        className={`ml-auto transition-transform ${
                                            mobileLangOpen ? "rotate-180" : ""
                                        }`}>
                                        <DropdownIcon />
                                    </span>
                                </button>
                                <AnimatePresence>
                                    {mobileLangOpen && (
                                        <motion.ul
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className='overflow-hidden bg-white dark:bg-black/70 rounded shadow mt-1'>
                                            {languages.map((lang) => (
                                                <li
                                                    key={lang.code}
                                                    onClick={() => {
                                                        setSelectedLang(lang);
                                                        setMobileLangOpen(
                                                            false
                                                        );
                                                        changeLanguage(
                                                            lang.code
                                                        );
                                                    }}
                                                    className='cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-4 py-2'>
                                                    {lang.label}
                                                </li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={toggleFullscreen}
                                aria-label='Toggle Fullscreen'
                                title='Toggle Fullscreen'
                                className='flex items-center gap-2 py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 border border-black/30 dark:border-white/40'>
                                {isFull ? (
                                    <Minimize2 size={20} />
                                ) : (
                                    <Maximize size={20} />
                                )}
                                <span>
                                    {isFull ? t("minimize") : t("fullscreen")}
                                </span>
                            </button>

                            <div>
                                <button
                                    className='flex items-center w-full py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
                                    onClick={() =>
                                        setMobileNotifOpen((v) => !v)
                                    }>
                                    <Bell className='mr-2' size={22} />
                                    <span>{t("notifications")}</span>
                                    <span className='ml-auto bg-red-500 text-white rounded-full px-2 text-xs'>
                                        {notifications.length}
                                    </span>
                                    <span
                                        className={`ml-2 transition-transform ${
                                            mobileNotifOpen ? "rotate-180" : ""
                                        }`}>
                                        <DropdownIcon />
                                    </span>
                                </button>
                                <AnimatePresence>
                                    {mobileNotifOpen && (
                                        <motion.ul
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className='overflow-hidden bg-white dark:bg-black/70 rounded shadow mt-1'>
                                            {notifications.map((notif) => (
                                                <li
                                                    key={notif.id}
                                                    className='px-4 py-2 border-b last:border-b-0 border-gray-200 dark:border-gray-700'>
                                                    {notif.text}
                                                </li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div>
                                <button
                                    className='flex items-center w-full py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
                                    onClick={() =>
                                        setMobileProfileOpen((v) => !v)
                                    }>
                                    <UserPen className='mr-2' size={22} />
                                    <span>{admin?.name || t("profile")}</span>
                                    <span
                                        className={`ml-auto transition-transform ${
                                            mobileProfileOpen
                                                ? "rotate-180"
                                                : ""
                                        }`}>
                                        <DropdownIcon />
                                    </span>
                                </button>
                                <AnimatePresence>
                                    {mobileProfileOpen && (
                                        <motion.ul
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className='overflow-hidden bg-white dark:bg-black/70 rounded shadow mt-1'>
                                            {profileActions.map((action) => (
                                                <li
                                                    key={action.id}
                                                    className='flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                                    onClick={action.onClick}>
                                                    {action.icon}
                                                    <span>{action.label}</span>
                                                </li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={() => setIsDark((v) => !v)}
                                className='flex items-center gap-2 py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 border border-black/30 dark:border-white/40'>
                                {isDark ? (
                                    <Moon size={20} />
                                ) : (
                                    <Sun size={20} />
                                )}
                                <span>
                                    {isDark ? t("dark_mode") : t("light_mode")}
                                </span>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
