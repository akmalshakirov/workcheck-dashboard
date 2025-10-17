import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { baseURL } from "../../App";
import { Button } from "../../components/ui/Button/Button";
import { Modal } from "../../components/ui/Modal/Modal";
const token = localStorage.getItem("token");

type PageProps = {
    visible: boolean;
    setVisible: (v: boolean) => void;
    getShifts: () => void;
};

type ShiftProps = {
    name: string;
    startTime: string;
    endTime: string;
    lateAllow: string;
};

export const AddShiftModal = ({
    visible,
    setVisible,
    getShifts,
}: PageProps) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(false);
    const [shiftData, setShiftData] = useState<ShiftProps>({
        name: "",
        lateAllow: "",
        startTime: "",
        endTime: "",
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShiftData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${baseURL}/shift/create`,
                shiftData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                toast.success(response.data.message);
                setVisible(false);
                setShiftData((prev) => ({
                    ...prev,
                    name: "",
                    endTime: "",
                    startTime: "",
                }));
                getShifts();
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.error || error);
            setVisible(false);
            setShiftData((prev) => ({
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
        <Modal visible={visible} title={t("shift_add")} width='45'>
            <form onSubmit={handleSubmit}>
                <div className='flex items-center lg:flex-row flex-col justify-between mb-4'>
                    <label
                        htmlFor='name'
                        className='block text-center lg:text-start'>
                        {t("add_shift_name")}:
                    </label>
                    <input
                        disabled={loading}
                        type='text'
                        inputMode='text'
                        value={shiftData.name}
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
                        value={shiftData.lateAllow}
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
                        value={shiftData.startTime}
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
                        value={shiftData.endTime}
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
                            onClick={() => setVisible(false)}>
                            {t("close")}
                        </Button>
                    )}
                    <Button type='submit' loading={loading}>
                        {t("ok")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
