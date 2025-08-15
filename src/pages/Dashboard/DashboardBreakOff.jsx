import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { baseURL } from "../../App";
import Table from "../../components/ui/Table/Table";
import { AddBreakOffModal } from "../../helpers/modals/AddBreakOffModal";
import { CustomTable } from "../../components/CustomTable";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "react-toastify";
import { Skeleton } from "../../components/ui/Skeleton/Skeleton";
const token = localStorage.getItem("token");

const DashboardBreakOffs = () => {
    const [addBreakOffModal, setAddBreakOffModal] = useState(false);
    const { t } = useTranslation();
    const [breakOffs, setBreakOffs] = useState([]);
    const [loading, setLoading] = useState(false);

    const breakOffsList = [
        {
            name: "Tanaffus nomi",
        },
        {
            name: "Boshlanish vaqti",
        },
        {
            name: "Tugash vaqti",
        },
    ];

    const columns = [
        {
            key: "name",
            header: "Tanaffus nomi",
        },
        {
            key: "startTime",
            header: "Boshlanish vaqti",
        },
        {
            key: "endTime",
            header: "Tugash vaqti",
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
            if (error.response.status !== 401) {
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
                    const token = localStorage.getItem("token");
                    const response = await axios.get(`${baseURL}/break-offs`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.status === 200) {
                        setAdminContent(response?.data?.admin);
                        setAdmin(response.data.admin);
                        setLoading(false);
                        isClose = true;
                    }
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                `${baseURL}/break-off/${id}/delete`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) toast.success(response.data.message);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllBreakOffs();
    }, []);

    return (
        <div>
            <div className='flex items-center gap-2.5 justify-between mb-4'>
                <h1 className='text-2xl font-bold'>{t("sidebar_smena")}</h1>
                <button
                    className='border rounded-lg p-1.5 px-3 bg-blue-600/80 hover:bg-blue-600 text-white active:scale-[0.95] active:bg-blue-700 duration-150 will-change-transform'
                    onClick={() => setAddBreakOffModal(!addBreakOffModal)}>
                    Add break off
                </button>
            </div>
            <AddBreakOffModal
                addBreakOffModal={addBreakOffModal}
                setAddBreakOffModal={setAddBreakOffModal}
            />
            {/* <Table
                data={breakOffs}
                list={breakOffsList}
                className='mt-7'
                actions={"DELETE"}
            /> */}
            {loading ? (
                Array.from({ length: 5 }).map((i, index) => (
                    <div
                        key={index}
                        className='flex h-[6vh] gap-1 items-center'>
                        <Skeleton className='w-full h-10' />
                    </div>
                ))
            ) : (
                <CustomTable
                    columns={columns}
                    data={breakOffs}
                    onDelete={handleDelete}
                    emptyMessage='DNX'
                    loading={loading}
                />
            )}
        </div>
    );
};

export default DashboardBreakOffs;
