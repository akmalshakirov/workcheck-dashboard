import axios from "axios";
import Swal from "sweetalert2";
import { baseURL } from "../../App";
import { useAdmin } from "../../hooks/useAdmin";

export const useApi = () => {
    const { setLoading, setAdmin } = useAdmin();
    const token = localStorage.getItem("token");
    const theme = localStorage.getItem("isDark");
    const lang = localStorage.getItem("lang");
    let isClose = false;

    const getAdmins = async ({ setPreloader, setAdmins }) => {
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
            if (error.code === "ERR_NETWORK") {
                Swal.fire("Internet aloqasi yo'q", "", "error");
            }
            if (error?.response?.status === 401) {
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
                        setAdmin(response.data.admin);
                    }
                }
            }
            Swal.fire({
                title: error?.response?.data?.error || error.name,
                icon: "error",
                didClose: isClose,
                theme: theme == "true" ? "dark" : "light",
            });
        } finally {
            setPreloader(false);
        }
    };

    const getProfile = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/profile`, {
                headers: { Authorization: `Bearer ${token}`, Accept: lang },
            });
            if (response.status === 200 || response.status === 304) {
                setAdmin(response.data.admin);
            }
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                Swal.fire("Internet aloqasi yo'q", "", "error");
            }
            if (error?.response?.status === 401) {
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
                        setAdmin(response.data.profile);
                        setLoading(false);
                        isClose = true;
                    }
                }
            }
            Swal.fire({
                title: error?.response?.data?.error || error.name,
                icon: "error",
                didClose: isClose,
                theme: theme == "true" ? "dark" : "light",
            });
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async ({
        profileData,
        setIsSubmitting,
        setIsEditing,
        setAdmin,
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
                title: error?.response?.data?.error || error,
                text: error?.response?.data?.error || error,
                icon: "error",
                timer: 50000,
                timerProgressBar: true,
                theme: theme == "true" ? "dark" : "light",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getBranches = async ({ setBranch }) => {
        try {
            const response = await axios.get(`${baseURL}/branches`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: lang,
                },
            });

            setBranch(response.data.branches);
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                Swal.fire("Internet aloqasi yo'q", "", "error");
            }
            if (error?.response?.status === 401) {
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
                        setBranch(response.data.branches);
                    }
                }
            }
            Swal.fire({
                title: error?.response?.data?.error || error.name,
                icon: "error",
                didClose: isClose,
                theme: theme == "true" ? "dark" : "light",
            });
        }
    };

    return { getAdmins, getBranches, getProfile, updateProfile };
};
