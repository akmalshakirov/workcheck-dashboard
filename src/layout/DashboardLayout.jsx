import {
    CalendarClock,
    ClockFading,
    LayoutDashboard,
    MapPin,
    ShieldUser,
    Shuffle,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/ui/Footer/Footer";
import { Header } from "../components/ui/Header/Header";
import { Sidebar, SidebarItem } from "../components/ui/Sidebar/Sidebar";
import { Skeleton } from "../components/ui/Skeleton/Skeleton";
import { useAdmin } from "../hooks/useAdmin";
import { useApi } from "../service/api/api";

const DashboardLayout = () => {
    const { branch, setBranch } = useAdmin();
    const { getProfile, getBranches } = useApi();
    const [collapsed, setCollapsed] = useState(
        localStorage.getItem("sidebar") == "true"
    );
    const token = localStorage.getItem("token");
    useEffect(() => {
        localStorage.setItem("sidebar", collapsed);
    }, [collapsed]);
    const { t } = useTranslation();

    useEffect(() => {
        getProfile();
        getBranches({ setBranch });
    }, []);

    return (
        <div className='flex bg-[#5f73e2] dark:bg-neutral-950 transition-colors duration-200'>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}>
                {branch === null ? (
                    <Skeleton className='w-full h-10' />
                ) : (
                    <select
                        name='branchId'
                        className='w-full px-2 border border-gray-400 rounded py-2 outline-none'>
                        {branch?.map((b) => (
                            <option value={b.id} key={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                )}

                <hr className='my-3 text-gray-500/50' />

                {!collapsed && (
                    <ul className='list-disc ml-3 mb-3'>
                        <li className='text-indigo-800 dark:text-indigo-400'>
                            {t("sidebar_main")}
                        </li>
                    </ul>
                )}
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

                {!collapsed && (
                    <ul className='list-disc ml-3 my-3'>
                        <li className='text-indigo-800 dark:text-indigo-400'>
                            {t("sidebar_additional")}
                        </li>
                    </ul>
                )}
                <SidebarItem
                    icon={<Shuffle size={22} />}
                    text={t("sidebar_smena")}
                    link={"/shift"}
                />
                <SidebarItem
                    icon={<ClockFading size={22} />}
                    text={t("sidebar_break_offs")}
                    link={"/break-offs"}
                />
                <SidebarItem
                    icon={<CalendarClock size={22} />}
                    text={t("sidebar_day_offs")}
                    link={"/day-offs"}
                />
            </Sidebar>
            <div className='flex-1 p-2.5 pl-1'>
                <Header collapsed={collapsed} setCollapsed={setCollapsed} />
                <main className='p-5 bg-white rounded-lg mt-3 dark:bg-[#111] dark:text-white text-black duration-200'>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default DashboardLayout;

// {/* <div>
//     <div className='flex items-center gap-2.5 justify-between mb-4'>
//         <h1 className='text-2xl font-bold'>{t("sidebar_break_offs")}</h1>
//         <button
//             className='border rounded-lg p-1.5 px-3 bg-blue-600/80 hover:bg-blue-600 text-white active:scale-[0.95] active:bg-blue-700 duration-150 will-change-transform'
//             onClick={() => setAddBreakOffModal(!addBreakOffModal)}>
//             Add break off
//         </button>
//     </div>
//     <AddBreakOffModal
//         addBreakOffModal={addBreakOffModal}
//         setAddBreakOffModal={setAddBreakOffModal}
//     />
//     {/* <Table
//                 data={breakOffs}
//                 list={breakOffsList}
//                 className='mt-7'
//                 actions={"DELETE"}
//             /> */}
//     {loading ? (
//         <>
//             {Array.from({ length: 5 }).map((i, index) => (
//                 <div key={index} className='flex h-[8vh] gap-1 items-center'>
//                     <Skeleton className='w-full h-10' />
//                 </div>
//             ))}
//         </>
//     ) : (
//         <CustomTable
//             columns={columns}
//             data={breakOffs}
//             emptyMessage='DNX'
//             loading={loading}
//             onDelete={handleDelete}
//             onEdit={handleEdit}
//             deleteIcon={<Delete />}
//             editIcon={<Edit />}
//             showIndex
//         />
//     )}
// </div>; */}
