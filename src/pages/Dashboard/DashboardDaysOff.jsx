import axios from "axios";
import { CalendarCog, CalendarX2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { baseURL } from "../../App";
import { CustomTable } from "../../components/CustomTable";
import { Button } from "../../components/ui/Button/Button";
import { Skeleton } from "../../components/ui/Skeleton/Skeleton";
import AddDayOffModal from "../../helpers/modals/AddDayOffModal";

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
                theme: theme == "true" ? "dark" : "light",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (item) => {
        alert(item.id);
        // try {
        //     const response = await axios.delete(
        //         `${baseURL}/day-off/${item.id}/delete`
        //     )

        // } catch (error) {
        //     console.log(error)
        // }
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
                        <div className='flex gap-2'>
                            <Button
                                onClick={() => setAddDayOffModal(true)}
                                leftIcon={<PlusCircle size={18} />}>
                                {t("add_day_off")}
                            </Button>
                        </div>
                    </div>
                    <div className='flex gap-2.5'>
                        <CustomTable
                            data={dayOffs}
                            columns={columns}
                            showIndex
                            className='w-full'
                            actions={"delete"}
                            editIcon={<CalendarCog className='text-white' />}
                            deleteIcon={<CalendarX2 className='text-white' />}
                            onDelete={handleDelete}
                        />
                    </div>
                    <AddDayOffModal
                        modalTitle={t("add_day_off")}
                        visible={addDayOffModal}
                        setVisible={setAddDayOffModal}
                        getAll={getDayOffs}
                    />
                </>
            )}
        </div>
    );
};

export default DashboardDaysOff;
