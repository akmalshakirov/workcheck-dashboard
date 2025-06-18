import { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { LiaUserEditSolid } from "react-icons/lia";
import { MdDashboard } from "react-icons/md";
import { RiShieldUserLine } from "react-icons/ri";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { Sidebar, SidebarItem } from "../components/Sidebar/Sidebar";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(
        localStorage.getItem("sidebar") == "true"
    );

    useEffect(() => {
        localStorage.setItem("sidebar", collapsed);
    }, [collapsed]);

    return (
        <div className='dashboard p-2.5 gap-3'>
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
                <Outlet>{children}</Outlet>
            </div>
        </div>
    );
};

export default DashboardLayout;
