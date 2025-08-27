import axios from "axios";
import { PencilLine, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { baseURL } from "../../App";
import { CustomTable } from "../../components/CustomTable";
import { Skeleton } from "../../components/ui/Skeleton/Skeleton";
import { AddBreakOffModal } from "../../helpers/modals/AddBreakOffModal";
const token = localStorage.getItem("token");

const DashboardBreakOffs = () => {
    const { t } = useTranslation();
    const [addBreakOffModal, setAddBreakOffModal] = useState(false);
    const [breakOffs, setBreakOffs] = useState([]);
    const [loading, setLoading] = useState(false);

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
            if (response.status === 200) {
                setBreakOffs(response.data.breakoffs);
            }
        } catch (error) {
            if (error?.response?.status !== 401) {
                Swal.fire({
                    title: error?.response?.data?.error,
                    icon: "error",
                    didClose: isClose,
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
        console.log(item.id);
        if (window.confirm(`${item.name} ni ochirmoqchimisiz?`)) {
            alert("OK");
        } else alert("NO");
        // try {
        //     const response = await axios.delete(
        //         `${baseURL}/break-off/${id}/delete`,
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${token}`,
        //             },
        //         }
        //     );

        //     if (response.status === 200) toast.success(response.data.message);
        // } catch (error) {
        //     console.log(error);
        // }
    };

    const handleEdit = async (item) => {
        confirm(item.id);
        // try {
        // const response = await
        // } catch (error) {}
    };

    useEffect(() => {
        getAllBreakOffs();
    }, []);

    return loading ? (
        Array.from({ length: 5 }).map((i, index) => (
            <div key={index} className='flex h-[8vh] gap-1 items-center'>
                <Skeleton className='w-full h-10' />
            </div>
        ))
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
                />
            </div>
            <CustomTable
                columns={columns}
                data={breakOffs}
                loading={loading}
                onDelete={handleDelete}
                onEdit={handleEdit}
                deleteIcon={
                    <Trash
                        size={20}
                        className='text-gray-800 dark:text-white'
                    />
                }
                editIcon={
                    <PencilLine
                        size={20}
                        className='text-gray-800 dark:text-white'
                    />
                }
                showIndex
            />
        </>
    );
};

export default DashboardBreakOffs;
