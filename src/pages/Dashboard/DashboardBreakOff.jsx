import axios from "axios";
import { PencilLine, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { baseURL } from "../../App";
import { CustomTable } from "../../components/CustomTable";
import { Skeleton } from "../../components/ui/Skeleton/Skeleton";
import { AddBreakOffModal } from "../../helpers/modals/AddBreakOffModal";
import { EditBreakOffModal } from "../../helpers/modals/EditBreakOffModal";

const DashboardBreakOffs = () => {
    const { t } = useTranslation();
    const theme = localStorage.getItem("isDark");
    const token = localStorage.getItem("token");
    const [addBreakOffModal, setAddBreakOffModal] = useState(false);
    const [editBreakOffModal, setEditBreakOffModal] = useState(false);
    const [breakOffs, setBreakOffs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const columns = [
        {
            header: t("break_off_name"),
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
            header: "late allow",
            key: "lateAllow",
        },
    ];

    const getAllBreakOffs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/break-offs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200 || response.status === 304) {
                setBreakOffs(response.data.breakoffs);
            }
        } catch (error) {
            if (error?.response?.status !== 401) {
                Swal.fire({
                    title: error?.response?.data?.error,
                    icon: "error",
                    theme: theme == "true" ? "dark" : "light",
                });
            } else if (
                error.code === "ERR_NETWORK" &&
                error.response.status !== 401
            ) {
                Swal.fire("Internet aloqasi yo'q", "", "error");
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
                    const response = await axios.get(`${baseURL}/break-offs`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.status === 200) {
                        setBreakOffs(response.data.breakoffs);
                    }
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: `Siz ${item.name} nomli tanaffusni o'chirmoqchimisiz?`,
            icon: "warning",
            allowOutsideClick: true,
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: t("ok2"),
            cancelButtonText: t("cancel"),
            theme: theme == "true" ? "dark" : "light",
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: t("preloader"),
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                theme: theme == "true" ? "dark" : "light",
            });
            try {
                const response = await axios.delete(
                    `${baseURL}/break-off/${item.id}/delete`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Swal.close();
                Swal.fire({
                    icon: "success",
                    title: response.data.message,
                    theme: theme == "true" ? "dark" : "light",
                });
                getAllBreakOffs();
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: error?.response?.data?.error || error?.name,
                    theme: theme == "true" ? "dark" : "light",
                });
            }
        }
    };

    useEffect(() => {
        getAllBreakOffs();
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
        <>
            <div>
                <div className='flex items-center gap-2.5 justify-between mb-4'>
                    <h1 className='text-2xl font-bold'>
                        {t("sidebar_break_offs")}
                    </h1>
                    <button
                        className='rounded-lg p-1.5 px-3 bg-blue-600/80 hover:bg-blue-600 text-white active:scale-[0.95] active:bg-blue-700 duration-150 will-change-transform'
                        onClick={() => setAddBreakOffModal(!addBreakOffModal)}>
                        Add break off
                    </button>
                </div>
                <AddBreakOffModal
                    addBreakOffModal={addBreakOffModal}
                    setAddBreakOffModal={setAddBreakOffModal}
                    getAllBreakOffs={getAllBreakOffs}
                />
                <EditBreakOffModal
                    getAllBreakOffs={getAllBreakOffs}
                    visible={editBreakOffModal}
                    setVisible={setEditBreakOffModal}
                    item={editItem}
                />
            </div>
            <CustomTable
                columns={columns}
                data={breakOffs}
                loading={loading}
                onDelete={handleDelete}
                deleteIcon={<Trash size={20} className='text-white' />}
                editIcon={<PencilLine size={20} className='text-white' />}
                showIndex
                actions={"delete"}
            />
        </>
    );
};

export default DashboardBreakOffs;
