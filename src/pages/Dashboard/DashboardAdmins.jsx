import { useEffect } from "react";

const DashboardAdmins = () => {
    // const [admins, setAdmins] = useState([]);

    useEffect(() => {
        // const getAdmins = async () => {
        //     try {
        //         const response = await axios.get(`${baseURL}/admins`, {
        //             withCredentials: true,
        //         });

        //         setAdmins(response.data.admins);
        //         console.log(response.data.admins);
        //     } catch (error) {
        //         if (error.response.data.status === 401) {
        //             navigate("/login");
        //         }
        //     }
        // };
        // getAdmins();
        document.title = "WorkCheck - Dashboard | Adminlar";
    }, []);

    return (
        <div>
            <h1>Admins</h1>
        </div>
    );
};

export default DashboardAdmins;
