import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";

export const useAdmin = () => {
    const { admin, setAdmin, branch, setBranch, loading, setLoading } =
        useContext(AdminContext);

    return {
        admin,
        setAdmin,
        isAdmin: admin?.role === "ADMIN" || admin?.role === "SUPERADMIN",
        isSuperAdmin: admin?.role === "SUPERADMIN",
        loading,
        setLoading,
        branch,
        setBranch,
    };
};
