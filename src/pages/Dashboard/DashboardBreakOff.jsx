import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AddBreakOffModal } from "../../helpers/modals/AddBreakOffModal";

const DashboardBreakOffs = () => {
    const [addBreakOffModal, setAddBreakOffModal] = useState(false);
    const { t } = useTranslation();

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
            <AddBreakOffModal
                addBreakOffModal={addBreakOffModal}
                setAddBreakOffModal={setAddBreakOffModal}
            />
            {/* <Modal
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
            </Modal> */}
        </div>
    );
};

export default DashboardBreakOffs;
