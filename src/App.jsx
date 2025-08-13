import React, { Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Preloader from "./components/ui/Preloader/Preloader";

const DashboardBreakOffs = React.lazy(() =>
    import("./pages/Dashboard/DashboardBreakOff.jsx")
);
const DashboardDaysOff = React.lazy(() =>
    import("./pages/Dashboard/DashboardDaysOff.jsx")
);
const DashboardShift = React.lazy(() =>
    import("./pages/Dashboard/DashboardShift.jsx")
);
const DashboardLayout = React.lazy(() =>
    import("./layout/DashboardLayout.jsx")
);
const DashboardAdmins = React.lazy(() =>
    import("./pages/Dashboard/DashboardAdmins")
);
const DashboardWorkers = React.lazy(() =>
    import("./pages/Dashboard/DashboardWorkers")
);
const DashboardProfile = React.lazy(() =>
    import("./pages/Dashboard/DashboardProfile")
);
const DashboardHome = React.lazy(() =>
    import("./pages/Dashboard/DashboardHome")
);
const DashboardBranch = React.lazy(() =>
    import("./pages/Dashboard/DashboardBranch.jsx")
);
const Login = React.lazy(() => import("./pages/Login/Login"));

export const baseURL = import.meta.env.VITE_API_URL;

export const App = () => {
    const token = localStorage.getItem("token");
    const theme = localStorage.getItem("isDark");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true });
        }
    }, []);

    return (
        <Suspense fallback={<Preloader />}>
            <ToastContainer
                position='top-center'
                autoClose={5000}
                limit={3}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme === "true" ? "dark" : "light"}
            />

            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/preloader' element={<Preloader />} />
                <Route path='/' element={<DashboardLayout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path='admins' element={<DashboardAdmins />} />
                    <Route path='workers' element={<DashboardWorkers />} />
                    <Route path='profile' element={<DashboardProfile />} />
                    <Route path='branch' element={<DashboardBranch />} />
                    <Route path='shift' element={<DashboardShift />} />
                    <Route path='day-offs' element={<DashboardDaysOff />} />
                    <Route path='break-offs' element={<DashboardBreakOffs />} />
                </Route>
                <Route path='/*' element={<Navigate to={"/login"} replace />} />
            </Routes>
        </Suspense>
    );
};
