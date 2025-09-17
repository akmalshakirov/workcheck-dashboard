import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { baseURL } from "../../App";
import { CustomTable } from "../../components/CustomTable";
import { Skeleton } from "../../components/ui/Skeleton/Skeleton";
import { useTranslation } from "react-i18next";
import { CalendarCog, CalendarX2 } from "lucide-react";

const DashboardDaysOff = () => {
    const token = localStorage.getItem("token");
    const theme = localStorage.getItem("isDark");
    const [dayOffs, setDayOffs] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [addDayOffModal, setAddDayOffModal] = useState(false);

    const getDayOffs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/day-offs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200 || response.status === 304) {
                setDayOffs(response.data.dayOffs);
            }
        } catch (error) {
            Swal.fire({
                title: error?.response?.data?.error || error?.name,
                icon: "error",
                theme: theme ? "light" : "dark",
            });
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: "Day Off Name",
            key: "name",
        },
        {
            header: "Dates",
            value: (item) => item.dates.map((i) => i.date).join(", "),
        },
    ];

    useEffect(() => {
        getDayOffs();
    }, []);

    return (
        <div>
            {loading ? (
                <div className='flex flex-col gap-3'>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className='flex h-[6vh] gap-1 items-center'>
                            <Skeleton className='w-full h-full' />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className='flex items-center justify-between mb-5'>
                        <h1 className='text-2xl font-bold'>
                            {t("sidebar_day_offs")}
                        </h1>
                        <button className='rounded-lg p-1.5 px-3 bg-blue-600/80 hover:bg-blue-600 text-white active:scale-[0.95] active:bg-blue-700 duration-150 will-change-transform'>
                            Add day off
                        </button>
                    </div>
                    <div className='flex gap-2.5'>
                        <CustomTable
                            data={dayOffs}
                            columns={columns}
                            showIndex
                            className='w-full'
                            actions={"edit delete"}
                            editIcon={<CalendarCog className='text-white' />}
                            deleteIcon={<CalendarX2 className='text-white' />}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardDaysOff;
