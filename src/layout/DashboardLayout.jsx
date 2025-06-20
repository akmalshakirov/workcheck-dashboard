import { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { LiaUserEditSolid } from "react-icons/lia";
import { MdDashboard } from "react-icons/md";
import { RiShieldUserLine } from "react-icons/ri";
import { Outlet } from "react-router-dom";
import { Header } from "../components/ui/Header/Header";
import { Sidebar, SidebarItem } from "../components/ui/Sidebar/Sidebar";
import "./DashboardLayout.css";

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(
        localStorage.getItem("sidebar") == "true"
    );

    useEffect(() => {
        localStorage.setItem("sidebar", collapsed);
    }, [collapsed]);

    return (
        <div className='dashboard p-2.5 gap-3 bg-[#5f73e2] dark:bg-[#3a3b3b] transition-colors duration-300'>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}>
                <SidebarItem
                    icon={<MdDashboard size={22} />}
                    text='Bosh sahifa'
                    link={"/"}
                />
                <SidebarItem
                    icon={<RiShieldUserLine size={22} />}
                    link={"/admins"}
                    text='Adminlar'
                />
                <SidebarItem
                    icon={<FiUsers size={22} />}
                    text='Ishchilar'
                    link={"/workers"}
                />
                <SidebarItem
                    icon={<LiaUserEditSolid size={22} />}
                    text='Mening profilim'
                    link={"/profile"}
                />
            </Sidebar>
            <div className='flex-1'>
                <Header collapsed={collapsed} setCollapsed={setCollapsed} />
                <main className='p-4 bg-white rounded-lg my-3 dark:bg-black/90 dark:text-white text-black'>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
