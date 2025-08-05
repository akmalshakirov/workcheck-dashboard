import axios from "axios";
import Swal from "sweetalert2";
import { baseURL } from "../../App";
const token = localStorage.getItem("token");
const theme = localStorage.getItem("isDark");
const lang = localStorage.getItem("lang");

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
        if (error.code === "ERR_NETWORK") {
            Swal.fire("Internet aloqasi yo'q", "", "error");
        } else {
            Swal.fire({
                title: error?.response?.data?.error || error,
                icon: "error",
                timer: 10000,
                timerProgressBar: true,
                theme: theme == "true" ? "dark" : "light",
            });
        }
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
    setIsLoading(true);
    try {
        const response = await axios.get(`${baseURL}/profile`, {
            headers: { Authorization: `Bearer ${token}`, Accept: lang },
        });
        if (response.status === 200) {
            setAdminContent(response.data.admin);
            setAdmin(response.data.admin);
            setIsLoading(false);
        }
    } catch (error) {
        Swal.fire(error.response.data.error, "", "error");
        if (error.code === "ERR_NETWORK") {
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
                    setAdminContent(response?.data?.admin);
                    setAdmin(response.data.admin);
                    setIsLoading(false);
                }
            }
        }
    }
};

export const updateProfile = async ({
    profileData,
    setIsSubmitting,
    setShowSuccess,
    setIsEditing,
    setAdmin,
    setAdminContent,
    token,
}) => {
    setIsSubmitting(true);
    
    try {
        // Validate required fields
        if (!profileData.name || !profileData.username) {
            throw new Error("Name and username are required");
        }

        // Validate phone number format if provided
        if (profileData.phone && !/^\+998\d{9}$/.test(profileData.phone)) {
            throw new Error("Phone number must be in format: +998XXXXXXXXX");
        }

        // Validate password if provided
        if (profileData.password && profileData.password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }

        const response = await axios.put(
            `${baseURL}/profile/update`,
            {
                name: profileData.name,
                username: profileData.username,
                phone: profileData.phone || null,
                password: profileData.password || null,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: lang,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status === 200) {
            // Update local state
            setAdmin(response.data.admin);
            setAdminContent(response.data.admin);
            
            // Show success message
            setShowSuccess(true);
            setIsEditing(false);
            
            // Reset form
            setTimeout(() => setShowSuccess(false), 3000);
            
            // Show success notification
            Swal.fire({
                title: "Profile updated successfully!",
                icon: "success",
                timer: 3000,
                timerProgressBar: true,
                theme: theme == "true" ? "dark" : "light",
            });
        }
    } catch (error) {
        console.error("Profile update error:", error);
        
        let errorMessage = "Failed to update profile";
        
        if (error.code === "ERR_NETWORK") {
            errorMessage = "Internet aloqasi yo'q";
        } else if (error.response?.status === 401) {
            errorMessage = "Authentication failed. Please login again.";
        } else if (error.response?.status === 422) {
            errorMessage = error.response.data.message || "Validation error";
        } else if (error.response?.status === 409) {
            errorMessage = "Username already exists";
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        Swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error",
            timer: 5000,
            timerProgressBar: true,
            theme: theme == "true" ? "dark" : "light",
        });
    } finally {
        setIsSubmitting(false);
    }
};

export const uploadImage = async ({
    file,
    setAdmin,
    setAdminContent,
    setIsLoading,
    token,
}) => {
    if (!file) {
        Swal.fire("Error", "Please select an image file", "error");
        return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
        Swal.fire("Error", "Please select a valid image file (JPEG, PNG, WebP)", "error");
        return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        Swal.fire("Error", "Image size must be less than 5MB", "error");
        return;
    }

    setIsLoading(true);
    
    try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post(
            `${baseURL}/profile/upload-image`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: lang,
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log("Upload progress:", percentCompleted);
                },
            }
        );

        if (response.status === 200) {
            // Update local state with new image
            setAdmin(prev => ({ ...prev, image: response.data.image }));
            setAdminContent(prev => ({ ...prev, image: response.data.image }));
            
            // Show success message
            Swal.fire({
                title: "Image uploaded successfully!",
                icon: "success",
                timer: 3000,
                timerProgressBar: true,
                theme: theme == "true" ? "dark" : "light",
            });
        }
    } catch (error) {
        console.error("Image upload error:", error);
        
        let errorMessage = "Failed to upload image";
        
        if (error.code === "ERR_NETWORK") {
            errorMessage = "Internet aloqasi yo'q";
        } else if (error.response?.status === 401) {
            errorMessage = "Authentication failed. Please login again.";
        } else if (error.response?.status === 413) {
            errorMessage = "Image file is too large";
        } else if (error.response?.status === 415) {
            errorMessage = "Invalid image format";
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        
        Swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error",
            timer: 5000,
            timerProgressBar: true,
            theme: theme == "true" ? "dark" : "light",
        });
    } finally {
        setIsLoading(false);
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
        if (error.code === "ERR_NETWORK") {
            Swal.fire("Internet aloqasi yo'q", "", "error");
        }
    }
};
