import { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";

export const useAdmin = () => {
    const { admin, setAdmin, branch, setBranch } = useContext(AdminContext);
    const [isLoading, setIsLoading] = useState(true);

    return {
        admin,
        setAdmin,
        isAdmin: admin?.role === "ADMIN" || admin?.role === "SUPERADMIN",
        isSuperAdmin: admin?.role === "SUPERADMIN",
        isLoading,
        setIsLoading,
        branch,
        setBranch,
    };
};
