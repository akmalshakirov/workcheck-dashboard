import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { baseURL } from "../../App";
import { CustomTable } from "../../components/CustomTable";
import { Skeleton } from "../../components/ui/Skeleton/Skeleton";

const DashboardDaysOff = () => {
    const { t } = useTranslation();
    const token = localStorage.getItem("token");
    const theme = localStorage.getItem("isDark");
    const [dayOffs, setDayOffs] = useState(null);
    const [loading, setLoading] = useState(false);
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
            header: "Header",
            key: "name",
        },
        // {
        //     header: "dates",
        //     key: "dates",
        //     value: (item) => {
        //         return item.dates && item.dates.length
        //             ? item?.dates?.map((i) => i.date).join(", ")
        //             : "-";
        //     },
        // },
    ];

    useEffect(() => {
        getDayOffs();
    }, []);

    return (
        <>
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
                <div className='flex gap-2.5'>
                    {/* console.log(!loading && dayOffs?.[0]?.dates?.map((i) => i)); */}
                    {/* <div>
                        {dayOffs?.map((day) => (
                            <div key={day?.id}>
                                {day.name}
                                {day.dates?.map((item, index) => (
                                    <p key={item.id ?? index}>{item?.date}</p>
                                ))}
                            </div>
                        ))}
                    </div> */}
                    <CustomTable
                        data={dayOffs}
                        columns={columns}
                        emptyMessage="Day offs aren't added yet"
                        showIndex
                        className='w-full'
                    />
                    <div className='bg-emerald-500 rounded-lg p-4 pb-30'>
                        Calendar...
                    </div>
                </div>
            )}
        </>
    );
};

export default DashboardDaysOff;
