import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { baseURL } from "../../App";
import { CustomTable } from "../../components/CustomTable";
import { Skeleton } from "../../components/ui/Skeleton/Skeleton";

const DashboardDaysOff = () => {
    const token = localStorage.getItem("token");
    const theme = localStorage.getItem("isDark");
    const [dayOffs, setDayOffs] = useState([]);
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
                    <CustomTable
                        data={dayOffs}
                        columns={columns}
                        emptyMessage="Day offs aren't added yet"
                        showIndex
                        className='w-full'
                    />
                </div>
            )}
        </>
    );
};

export default DashboardDaysOff;
