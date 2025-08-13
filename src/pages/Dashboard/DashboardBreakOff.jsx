import axios from "axios";
import { LoaderCircleIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { baseURL } from "../../App";
import { Modal } from "../../components/ui/Modal/Modal";
const token = localStorage.getItem("token");

const DashboardBreakOffs = () => {
    const { t } = useTranslation();
    const [addBreakOffModal, setAddBreakOffModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [breakOffData, setBreakOffData] = useState({
        name: "",
        startTime: "",
        endTime: "",
    });

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setBreakOffData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${baseURL}/break-off/create`,
                breakOffData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                toast.success(response.data.message);
                setAddBreakOffModal(false);
                setBreakOffData((prev) => ({
                    ...prev,
                    name: "",
                    endTime: "",
                    startTime: "",
                }));
            }
        } catch (error) {
            toast.error(error.response.data.error);
            setAddBreakOffModal(false);
            setBreakOffData((prev) => ({
                ...prev,
                name: "",
                endTime: "",
                startTime: "",
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='flex items-center gap-2.5 justify-between'>
                <h1 className='text-2xl font-bold'>{t("sidebar_smena")}</h1>
                <button
                    className='border rounded-lg p-1.5 px-3 bg-blue-600/80 hover:bg-blue-600 text-white active:scale-[0.95] active:bg-blue-700 duration-150 will-change-transform'
                    onClick={() => setAddBreakOffModal(!addBreakOffModal)}>
                    Add break off
                </button>
            </div>
            <Modal
                visible={addBreakOffModal}
                title={"ADD BREAK OFF"}
                width='38'>
                <form
                    onSubmit={handleSubmit}
                    className='flex gap-2.5 flex-col justify-start'>
                    <div className='mb-4'>
                        <label htmlFor='name' className='block'>
                            {t("break_off_name")}:
                        </label>
                        <input
                            disabled={loading}
                            type='text'
                            inputMode='text'
                            value={breakOffData.name}
                            onChange={handleInputChange}
                            autoComplete='off'
                            required
                            name='name'
                            id='name'
                            className='border border-gray-500/70 text-sm rounded-lg outline-none focus:ring-blue-400 focus:ring-1 p-2 transition w-full disabled:opacity-50'
                        />
                    </div>
                    <div className='flex items-center justify-between mb-4'>
                        <label htmlFor='startTime' className='block'>
                            {t("break_off_start_time")}:
                        </label>
                        <input
                            disabled={loading}
                            type='time'
                            value={breakOffData.startTime}
                            onChange={handleInputChange}
                            autoComplete='off'
                            required
                            name='startTime'
                            id='startTime'
                            className='border border-gray-500/70 text-sm rounded-lg outline-none focus:ring-blue-400 focus:ring-1 p-2 transition w-1/4 disabled:opacity-50'
                        />
                        <label htmlFor='endTime' className='block'>
                            {t("break_off_end_time")}:
                        </label>
                        <input
                            disabled={loading}
                            type='time'
                            value={breakOffData.endTime}
                            onChange={handleInputChange}
                            autoComplete='off'
                            required
                            name='endTime'
                            id='endTime'
                            className='border border-gray-500/70 text-sm rounded-lg outline-none focus:ring-blue-400 focus:ring-1 p-2 transition w-1/4 disabled:opacity-50'
                        />
                    </div>
                    <div className='flex items-center gap-2.5 justify-end'>
                        <button
                            type='reset'
                            className='py-1.5 px-3 rounded-lg bg-red-600/80 hover:bg-red-600 duration-150 text-white active:scale-[0.95] will-change-transform disabled:opacity-50 disabled:cursor-not-allowed!'
                            onClick={() => setAddBreakOffModal(false)}
                            disabled={loading}>
                            {t("close")}
                        </button>
                        <button
                            type='submit'
                            className='border rounded-lg p-1.5 px-3 bg-blue-600/80 hover:bg-blue-600 text-white active:scale-[0.95] active:bg-blue-700 duration-150 will-change-transform disabled:opacity-50 disabled:cursor-not-allowed!'
                            disabled={loading}>
                            {loading ? (
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
        </div>
    );
};

export default DashboardBreakOffs;
