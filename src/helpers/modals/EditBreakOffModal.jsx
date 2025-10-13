import axios from "axios";
import { LoaderCircleIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { baseURL } from "../../App";
import { Modal } from "../../components/ui/Modal/Modal";

export const EditBreakOffModal = ({
    visible,
    setVisible,
    getAllBreakOffs,
    item,
}) => {
    const { t } = useTranslation();
    const token = localStorage.getItem("token");
    const theme = localStorage.getItem("isDark");
    const [editItemLoading, setEditItemLoading] = useState(false);
    const [breakOffData, setBreakOffData] = useState({
        name: "",
        startTime: "",
        endTime: "",
        lateAllow: "",
    });

    useEffect(() => {
        if (!item) return;
        setBreakOffData({
            name: item?.name,
            startTime: item?.startTime,
            endTime: item?.endTime,
            lateAllow: item?.lateAllow,
        });
    }, [item]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setBreakOffData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEditItemLoading(true);
        try {
            const response = await axios.put(
                `${baseURL}/break-off/${item.id}/update`,
                breakOffData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success(response.data.message);
        } catch (error) {
            Swal.fire({
                title: error?.response?.data?.error || error?.name,
                icon: "error",
                theme: theme == "true" ? "dark" : "light",
            });
        } finally {
            getAllBreakOffs();
            setEditItemLoading(false);
            setVisible(false);
            setBreakOffData({
                name: "",
                startTime: "",
                endTime: "",
                lateAllow: "",
            });
        }
    };

    return (
        <Modal visible={visible} title={"Edit break off"} width='69'>
            <form onSubmit={handleSubmit}>
                <div className='flex items-center lg:flex-row flex-col justify-between mb-4 gap-2'>
                    <div className='flex items-center justify-between'>
                        <label
                            htmlFor='name'
                            className='block text-center lg:text-start'>
                            {t("break_off_name")}:
                        </label>
                        <input
                            disabled={editItemLoading}
                            type='text'
                            inputMode='text'
                            value={breakOffData.name}
                            onChange={handleInputChange}
                            autoComplete='off'
                            required
                            name='name'
                            autoFocus
                            id='name'
                            className='border border-gray-500/70 text-sm rounded-lg outline-none focus:ring-blue-400 focus:ring-1 p-2 transition w-full lg:w-1/4 disabled:opacity-50'
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <label
                            htmlFor='lateAllow'
                            className='block text-center lg:text-start'>
                            {t("break_off_lateAllow")}:
                        </label>
                        <input
                            disabled={editItemLoading}
                            type='number'
                            min={10}
                            minLength={10}
                            max={30}
                            maxLength={30}
                            inputMode='numeric'
                            value={breakOffData.lateAllow}
                            onChange={handleInputChange}
                            autoComplete='off'
                            required
                            name='lateAllow'
                            id='lateAllow'
                            className='border border-gray-500/70 text-sm rounded-lg outline-none focus:ring-blue-400 focus:ring-1 p-2 transition w-full lg:w-1/4 disabled:opacity-50'
                        />
                    </div>
                </div>
                <div className='flex items-center lg:flex-row flex-col justify-between mb-4'>
                    <label htmlFor='startTime' className='block'>
                        {t("break_off_start_time")}:
                    </label>
                    <input
                        disabled={editItemLoading}
                        type='time'
                        value={breakOffData.startTime}
                        onChange={handleInputChange}
                        autoComplete='off'
                        required
                        name='startTime'
                        id='startTime'
                        className='border border-gray-500/70 text-sm rounded-lg outline-none focus:ring-blue-400 focus:ring-1 p-2 transition w-full lg:w-1/4 disabled:opacity-50'
                    />
                    <label htmlFor='endTime' className='block'>
                        {t("break_off_end_time")}:
                    </label>
                    <input
                        disabled={editItemLoading}
                        type='time'
                        value={breakOffData.endTime}
                        onChange={handleInputChange}
                        autoComplete='off'
                        required
                        name='endTime'
                        id='endTime'
                        className='border border-gray-500/70 text-sm rounded-lg outline-none focus:ring-blue-400 focus:ring-1 p-2 transition w-full lg:w-1/4 disabled:opacity-50'
                    />
                </div>
                <div className='flex items-center gap-2.5 justify-end'>
                    <button
                        type='reset'
                        className='py-1.5 px-3 rounded-lg bg-red-600/80 hover:bg-red-600 duration-150 text-white active:scale-[0.95] will-change-transform disabled:opacity-50 disabled:cursor-not-allowed!'
                        onClick={() => setVisible(false)}
                        disabled={editItemLoading}>
                        {t("close")}
                    </button>
                    <button
                        type='submit'
                        className='rounded-lg p-1.5 px-3 bg-blue-600/80 hover:bg-blue-600 text-white active:scale-[0.95] active:bg-blue-700 duration-150 will-change-transform disabled:opacity-50 disabled:cursor-not-allowed!'
                        disabled={editItemLoading}>
                        {editItemLoading ? (
                            <>
                                <LoaderCircleIcon className='animate-spin' />
                            </>
                        ) : (
                            t("ok")
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
