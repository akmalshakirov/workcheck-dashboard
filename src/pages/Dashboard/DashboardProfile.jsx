import { useEffect } from "react";

const DashboardProfile = ({ admin }) => {
    useEffect(() => {
        document.title = "WorkCheck - Dashboard | Mening profilim";
    }, []);
    return (
        <div>
            <div className='border border-gray-400 rounded shadow p-2'>
                <div>
                    <img src={admin?.image} alt={admin?.name} />
                </div>
            </div>
        </div>
    );
};

export default DashboardProfile;
