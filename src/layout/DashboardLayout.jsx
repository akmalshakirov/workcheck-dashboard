import { LayoutDashboard, ShieldUser, UserCog, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { Header } from "../components/ui/Header/Header";
import { Sidebar, SidebarItem } from "../components/ui/Sidebar/Sidebar";
import Footer from "../components/ui/Footer/Footer";

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(
        localStorage.getItem("sidebar") == "true"
    );

    useEffect(() => {
        localStorage.setItem("sidebar", collapsed);
    }, [collapsed]);

    const { t } = useTranslation();

    return (
        <div className='flex bg-[#5f73e2] dark:bg-[#3a3b3b] transition-colors duration-300'>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}>
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
                    icon={<UserCog size={22} />}
                    text={t("sidebar_profile")}
                    link={"/profile"}
                />
            </Sidebar>
            <div className='flex-1 p-2.5 pl-1'>
                <Header collapsed={collapsed} setCollapsed={setCollapsed} />
                <main className='p-4 bg-white rounded-lg mt-3 dark:bg-black/90 dark:text-white text-black'>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default DashboardLayout;
