import axios from "axios";
import { LoaderCircleIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { baseURL } from "../../App";
import { Modal } from "../../components/ui/Modal/Modal";
import { Button } from "../../components/ui/Button/Button";
const token = localStorage.getItem("token");

export const AddBreakOffModal = ({
    addBreakOffModal,
    setAddBreakOffModal,
    getAllBreakOffs,
}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [breakOffData, setBreakOffData] = useState({
        name: "",
        startTime: "",
        endTime: "",
        lateAllow: "",
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

            if (response.status === 201) {
                toast.success(response.data.message);
                setAddBreakOffModal(false);
                setBreakOffData((prev) => ({
                    ...prev,
                    name: "",
                    endTime: "",
                    startTime: "",
                }));
                getAllBreakOffs();
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || error);
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
        <Modal visible={addBreakOffModal} title={"ADD BREAK OFF"} width='45'>
            <form onSubmit={handleSubmit}>
                <div className='flex items-center lg:flex-row flex-col justify-between mb-4'>
                    <label
                        htmlFor='name'
                        className='block text-center lg:text-start'>
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
                        className='border border-gray-500/70 text-sm rounded-lg outline-none focus:ring-blue-400 focus:ring-1 p-2 transition w-full lg:w-1/4 disabled:opacity-50'
                        autoFocus
                    />
                    <label
                        htmlFor='lateAllow'
                        className='block text-center lg:text-start'>
                        {t("break_off_lateAllow")}:
                    </label>
                    <input
                        disabled={loading}
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
                <div className='flex items-center lg:flex-row flex-col justify-between mb-4'>
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
                        className='border border-gray-500/70 text-sm rounded-lg outline-none focus:ring-blue-400 focus:ring-1 p-2 transition w-full lg:w-1/4 disabled:opacity-50'
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
                        className='border border-gray-500/70 text-sm rounded-lg outline-none focus:ring-blue-400 focus:ring-1 p-2 transition w-full lg:w-1/4 disabled:opacity-50'
                    />
                </div>
                <div className='flex items-center gap-2.5 justify-end'>
                    {!loading && (
                        <Button
                            variant='danger'
                            type='reset'
                            onClick={() => setAddBreakOffModal(false)}>
                            {t("close")}
                        </Button>
                    )}
                    <Button type='submit' loading={loading}>
                        {loading ? t("sending") : t("ok")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
