import axios, { AxiosResponse } from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { baseURL } from "../../App";
import { Button } from "../../components/ui/Button/Button";
import { Modal } from "../../components/ui/Modal/Modal";

type AddDayOffProps = {
    visible: boolean;
    setVisible: (v: boolean) => void;
    modalTitle: string;
};

const AddDayOffModal = ({
    visible,
    setVisible,
    modalTitle,
}: AddDayOffProps) => {
    const { t } = useTranslation();
    const [addDayOffLoading, setDayOffLoading] = useState<boolean>(false);
    const [dayOffData, setDayOffData] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string[]>([]);
    const token = localStorage.getItem("token");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setDayOffLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        try {
            const response = await axios.post<AxiosResponse>(
                `${baseURL}/day-off/create`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    formData,
                }
            );
            if (response.status === 201) {
                toast.success(response.data as any);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setDayOffLoading(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedDate([e.target.value]);
        console.log(e.target.value);
    };

    return (
        <Modal visible={visible} title={modalTitle} width='40'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                <label className='flex flex-col gap-2'>
                    {t("add_day_off_name")}:
                    <input
                        type='text'
                        className='border border-gray-500/70 rounded-lg outline-none focus:ring-blue-400 focus:ring-1 p-2 transition disabled:opacity-50'
                        minLength={3}
                        maxLength={20}
                        name='day-off-name'
                        required
                        aria-required
                        disabled={addDayOffLoading}
                        title={t("add_day_off_name")}
                    />
                </label>
                <label className='flex flex-col gap-2'>
                    Dam olish kunini sana(lar):
                    <input
                        value={selectedDate}
                        onChange={handleChange}
                        type='date'
                        name='dates'
                        className='border border-gray-500/70 rounded-lg outline-none focus:ring-blue-400 focus:ring-1 p-2 transition disabled:opacity-50'
                    />
                </label>
                {selectedDate.map((d, index) => (
                    <span
                        key={index}
                        className={`mt-2 w-max border rounded-lg p-2 border-blue-800/50 bg-blue-200 transition-all duration-150 ${
                            selectedDate?.length > 0
                                ? "opacity-100 pointer-events-auto"
                                : "opacity-0 pointer-events-none"
                        }`}>
                        {d}
                    </span>
                ))}
                <div className='flex justify-end gap-2 mt-5'>
                    {!addDayOffLoading && (
                        <Button
                            variant='danger'
                            onClick={() => setVisible(false)}
                            type='reset'>
                            {t("cancel")}
                        </Button>
                    )}
                    <Button type='submit' loading={addDayOffLoading}>
                        {addDayOffLoading ? t("sending") : t("ok")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AddDayOffModal;
