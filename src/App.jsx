import React, { Suspense } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
// import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Preloader from "./components/ui/Preloader/Preloader";
import { useAuth } from "./hooks/useAuth";

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

export const baseURL = process.env.BASE_URL;

const App = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    return (
        <Suspense fallback={<Preloader />}>
            <ToastContainer
                position='top-right'
                autoClose={10000}
                limit={3}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Slide}
            />
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/' element={<DashboardLayout />}>
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
