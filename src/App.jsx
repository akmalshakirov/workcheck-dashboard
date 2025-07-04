import React, { Suspense, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loader from "./components/ui/Loader/Loader";
import Preloader from "./components/ui/Preloader/Preloader";

const DashboardLayout = React.lazy(() => import("./layout/DashboardLayout"));
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
const Login = React.lazy(() => import("./pages/Login/Login"));

// export const baseURL = "http://localhost:7000";
export const baseURL = "https://workcheck.onrender.com";

const App = () => {
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
                position='top-right'
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
                <Route path='/loader' element={<Loader />} />
                <Route
                    path='/'
                    element={token ? <DashboardLayout /> : <Login />}>
                    <Route index element={<DashboardHome />} />
                    <Route path='admins' element={<DashboardAdmins />} />
                    <Route path='workers' element={<DashboardWorkers />} />
                    <Route path='profile' element={<DashboardProfile />} />
                </Route>
                <Route path='*' element={<h1>Page Not Found</h1>} />
            </Routes>
        </Suspense>
    );
};

export default App;
