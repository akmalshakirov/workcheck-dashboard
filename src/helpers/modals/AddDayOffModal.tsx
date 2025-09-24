import { ChangeEvent, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
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
    const [addDayOffLoading, setDayOffLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(
        new Date().getDay().toString()
    );

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setDayOffLoading(true);
        setTimeout(() => {
            setVisible(false);
            setDayOffLoading(false);
        }, 7777);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value as any);
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
                        multiple
                        onChange={handleChange}
                        type='date'
                        name='dates'
                        className='border border-gray-500/70 rounded-lg outline-none focus:ring-blue-400 focus:ring-1 p-2 transition disabled:opacity-50'
                    />
                </label>
                <span
                    className={`mt-2 w-max border rounded-lg p-2 border-blue-800/50 bg-blue-200 transition-all duration-150 ${
                        selectedDate.length > 0
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none"
                    }`}>
                    {selectedDate}
                </span>
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
