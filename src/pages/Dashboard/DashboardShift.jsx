import axios from "axios";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { baseURL } from "../../App";
import { CustomTable } from "../../components/CustomTable";
import { Button } from "../../components/ui/Button/Button";
import { Skeleton } from "../../components/ui/Skeleton/Skeleton";
import { AddShiftModal } from "../../helpers/modals/AddShiftModal";
const token = localStorage.getItem("token");

const DashboardShift = () => {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            header: t("add_shift_name"),
            key: "name",
        },
        {
            header: t("break_off_start_time"),
            key: "startTime",
        },
        {
            header: t("break_off_end_time"),
            key: "endTime",
        },
        {
            header: t("break_off_lateAllow"),
            key: "lateAllow",
        },
    ];

    const getAllShifts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/shifts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setShifts(response.data.shifts);
        } catch (error) {
            toast.error(error?.response?.data?.error || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllShifts();
    }, []);

    return loading ? (
        <div className='flex flex-col gap-3'>
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className='flex h-[6vh] gap-1 items-center'>
                    <Skeleton className='w-full h-full' />
                </div>
            ))}
        </div>
    ) : (
        <div>
            <div className='flex items-center justify-between mb-4'>
                <h1 className='text-2xl font-bold'>{t("sidebar_smena")}</h1>
                <Button
                    leftIcon={<CirclePlus size={18} />}
                    onClick={() => setVisible(true)}>
                    {t("shift_add")}
                </Button>
            </div>
            <AddShiftModal
                visible={visible}
                setVisible={setVisible}
                getShifts={getAllShifts}
            />
            <CustomTable data={shifts} columns={columns} actions={"delete"} />
        </div>
    );
};
export default DashboardShift;
