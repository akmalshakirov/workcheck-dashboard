import { useEffect, useState } from "react";
import { AddWorkerModal } from "../../helpers/modals/AddWorkerModal";

const DashboardWorkers = () => {
    const [addModalOpen, setAddModalOpen] = useState(false);
    useEffect(() => {
        document.title = "WorkCheck - Dashboard | Ishchilar";
    }, []);
    return (
        <div>
            <div>
                <button onClick={() => setAddModalOpen(true)}>
                    Ishchi qo'shish
                </button>
            </div>
            <AddWorkerModal isVisible={addModalOpen} />
        </div>
    );
};

export default DashboardWorkers;
