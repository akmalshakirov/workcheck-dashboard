import axios from "axios";
import Swal from "sweetalert2";
import { baseURL } from "../../App";
const theme = localStorage.getItem("isDark");

export const getAdmins = async ({ setPreloader, setAdmins, token, lang }) => {
    setPreloader(true);
    try {
        const response = await axios.get(`${baseURL}/admins`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: lang,
            },
        });
        setAdmins(response?.data?.admins);
    } catch (error) {
        Swal.fire({
            title: error?.response?.data?.error || error,
            icon: "error",
            timer: 10000,
            timerProgressBar: true,
            theme: theme == "true" ? "dark" : "light",
        });
    } finally {
        setPreloader(false);
    }
};

export const getProfile = async ({
    token,
    setAdminContent,
    setAdmin,
    setIsLoading,
}) => {
    try {
        const response = await axios.get(`${baseURL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
            setAdminContent(response.data.admin);
            setAdmin(response.data.admin);
            setIsLoading(false);
        }
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            toast.info("Internet aloqasi yo'q");
        } else if (error?.response?.status === 401) {
            const refreshResponse = await axios.post(
                `${baseURL}/refresh`,
                {},
                {
                    withCredentials: true,
                }
            );

            if (refreshResponse.status === 200) {
                localStorage.setItem("token", refreshResponse.data.token);
                const token = localStorage.getItem("token");
                const response = await axios.get(`${baseURL}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setAdminContent(response?.data?.admin);
                    setAdmin(response.data.admin);
                    setIsLoading(false);
                }
            }
        }
    }
};
