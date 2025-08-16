import axios from "axios";
import Swal from "sweetalert2";
import { baseURL } from "../../App";
const token = localStorage.getItem("token");

const theme = localStorage.getItem("isDark");
const lang = localStorage.getItem("lang");
let isClose = false;

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
        if (error.response.status !== 401) {
            Swal.fire({
                title: error?.response?.data?.error,
                icon: "error",
                didClose: isClose,
                theme: theme == "true" ? "dark" : "light",
            });
        } else if (
            error.code === "ERR_NETWORK" &&
            error.response.status !== 401
        ) {
            Swal.fire("Internet aloqasi yo'q", "", "error");
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
                const response = await axios.get(`${baseURL}/admins`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setAdmins(response.data.admins);
                }
            }
        }
    } finally {
        setPreloader(false);
    }
};

export const getProfile = async (
    setAdmin,
    setAdminContent,
    setLoading,
    token
) => {
    setLoading(true);
    try {
        const response = await axios.get(`${baseURL}/profile`, {
            headers: { Authorization: `Bearer ${token}`, Accept: lang },
        });
        if (response.status === 200) {
            setAdminContent(response.data.admin);
            setAdmin(response.data.admin);
            setLoading(false);
        }
    } catch (error) {
        if (error?.response?.status !== 401) {
            Swal.fire({
                title: error?.response?.data?.error || error,
                icon: "error",
                didClose: isClose,
                theme: theme == "true" ? "dark" : "light",
            });
            console.log(error);
        } else if (
            error.code === "ERR_NETWORK" &&
            error.response.status !== 401
        ) {
            Swal.fire("Internet aloqasi yo'q", "", "error");
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
                    setAdmin(response.data.admin);
                    setLoading(false);
                    isClose = true;
                }
            }
        }
    }
};

export const updateProfile = async ({
    profileData,
    setIsSubmitting,
    setIsEditing,
    setAdmin,
    token,
}) => {
    setIsSubmitting(true);

    try {
        const response = await axios.put(
            `${baseURL}/profile/update`,
            profileData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: lang,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status === 200) {
            setAdmin(response.data.admin);

            setIsEditing(false);
            Swal.fire({
                title: response?.data?.message,
                icon: "success",
                timer: 3000,
                timerProgressBar: true,
                theme: theme == "true" ? "dark" : "light",
            });
        }
    } catch (error) {
        Swal.fire({
            title: error?.response?.data?.error,
            text: error?.response?.data?.error,
            icon: "error",
            timer: 50000,
            timerProgressBar: true,
            theme: theme == "true" ? "dark" : "light",
        });
    } finally {
        setIsSubmitting(false);
    }
};

export const getBranches = async ({ setBranch }) => {
    try {
        const response = await axios.get(`${baseURL}/branches`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: lang,
            },
        });

        setBranch(response.data.branches);
    } catch (error) {
        if (error?.response?.status !== 401) {
            Swal.fire({
                title: error?.response?.data?.error,
                icon: "error",
                didClose: isClose,
                theme: theme == "true" ? "dark" : "light",
            });
        } else if (
            error.code === "ERR_NETWORK" &&
            error.response.status !== 401
        ) {
            Swal.fire("Internet aloqasi yo'q", "", "error");
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
                const response = await axios.get(`${baseURL}/branches`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setBranch(response.data.admin);
                }
            }
        }
    }
};
