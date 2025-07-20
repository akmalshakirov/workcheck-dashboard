import axios from "axios";
import { LayoutDashboard, MapPin, ShieldUser, Users } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { baseURL } from "../App";
import { Footer } from "../components/ui/Footer/Footer";
import { Header } from "../components/ui/Header/Header";
import { Sidebar, SidebarItem } from "../components/ui/Sidebar/Sidebar";
import { AdminContext } from "../context/AdminContext";

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(
        localStorage.getItem("sidebar") == "true"
    );
    const [admin, setAdmin] = useState(null);
    const token = localStorage.getItem("token");
    const { loading } = useContext(AdminContext);

    useEffect(() => {
        localStorage.setItem("sidebar", collapsed);
    }, [collapsed]);

    const { t } = useTranslation();

    const getProfile = async () => {
        try {
            const response = await axios.get(`${baseURL}/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) setAdmin(response.data.admin);
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                toast.info("Internet aloqasi yo'q");
            } else if (error?.response?.status === 401) {
                const refreshResponse = await axios.post(
                    `${baseURL}/refresh`,
                    {},
                    {
                        withCredentials: true,
                    }
                );

                if (refreshResponse.status === 200) {
                    localStorage.setItem("token", refreshResponse.data.token);
                    const token = localStorage.getItem("token");
                    const response = await axios.get(`${baseURL}/profile`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.status === 200) {
                        setAdmin(response?.data?.admin);
                    }
                }
            }
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <div className='flex bg-[#5f73e2] dark:bg-[#000] transition-colors duration-200'>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}>
                <select
                    name='branch'
                    className='w-full px-2 border border-gray-400 rounded py-2 outline-none'>
                    <option value='nothing'>Filial tanlang...</option>
                    <option value='bir'>Birinchi filial</option>
                </select>
                <hr className='my-3 text-gray-500/50' />
                <SidebarItem
                    icon={<LayoutDashboard size={22} />}
                    text={t("sidebar_dashboard")}
                    link={"/"}
                />
                <SidebarItem
                    icon={<ShieldUser size={22} />}
                    link={"/admins"}
                    text={t("sidebar_admins")}
                />
                <SidebarItem
                    icon={<Users size={22} />}
                    text={t("sidebar_workers")}
                    link={"/workers"}
                />
                <SidebarItem
                    icon={<MapPin size={22} />}
                    text={t("sidebar_branch")}
                    link={"/branch"}
                />
            </Sidebar>
            <div className='flex-1 p-2.5 pl-1'>
                <Header
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    admin={admin}
                />
                <main className='p-5 bg-white rounded-lg mt-3 dark:bg-[#111] dark:text-white text-black duration-200'>
                    <Outlet context={admin} />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default DashboardLayout;
