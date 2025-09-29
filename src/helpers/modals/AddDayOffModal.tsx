import axios from "axios";
import { X } from "lucide-react";
import { ChangeEvent, FC, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { baseURL } from "../../App";
import { Button } from "../../components/ui/Button/Button";
import { Modal } from "../../components/ui/Modal/Modal";

type AddDayOffProps = {
    visible: boolean;
    setVisible: (v: boolean) => void;
    modalTitle: string;
    getAll: () => void;
};

const AddDayOffModal: FC<AddDayOffProps> = ({
    visible,
    setVisible,
    modalTitle,
    getAll,
}) => {
    const { t } = useTranslation();
    const [addDayOffLoading, setDayOffLoading] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [dates, setDates] = useState<string[]>([]);
    const [dayOffName, setDayOffName] = useState<string>("");
    const token = localStorage.getItem("token");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setDayOffLoading(true);

        try {
            const response = await axios.post(
                `${baseURL}/day-off/create`,
                {
                    name: dayOffName,
                    dates,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                toast.success(response.data.message as string);
                setVisible(false);
                getAll();
            }
        } catch (error) {
            toast.error(error as any);
        } finally {
            setDayOffLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!val) {
            setSelectedDate("");
            return;
        }

        setSelectedDate(e.target.value);
        setDates((prev) => {
            const exists = prev.includes(val);
            const next = exists
                ? prev.filter((d) => d !== val)
                : [...prev, val];
            return next.slice().sort();
        });
    };

    const handleRemoveDate = (d: string) => {
        return setDates((prev) => prev.filter((x) => x !== d));
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDayOffName(e.target.value);
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
                        name='name'
                        required
                        aria-required
                        disabled={addDayOffLoading}
                        title={t("add_day_off_name")}
                        value={dayOffName}
                        onChange={handleInputChange}
                        autoComplete='on'
                    />
                </label>
                <label className='flex flex-col gap-2'>
                    Dam olish kunini sana(lar):
                    <input
                        value={selectedDate}
                        onChange={handleChange}
                        type='date'
                        name='dates'
                        disabled={addDayOffLoading}
                        className='border border-gray-500/70 rounded-lg outline-none focus:ring-blue-400 focus:ring-1 p-2 transition disabled:opacity-50'
                        required
                        aria-required
                        autoComplete='off'
                    />
                </label>
                <div className='flex items-center flex-wrap gap-3'>
                    {dates.map((d, index) => (
                        <div
                            key={index}
                            className='flex items-center gap-2 border rounded-lg px-2 py-1.5 border-blue-800/50 bg-blue-200'>
                            {d}
                            <button
                                className='p-0.5 border rounded-lg border-blue-500 bg-blue-300 active:bg-blue-400 transition'
                                type='reset'
                                onClick={() => handleRemoveDate(d)}>
                                <X size={19} />
                            </button>
                        </div>
                    ))}
                </div>
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
