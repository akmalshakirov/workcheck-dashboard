import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
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

const App = () => {
    return (
        <>
            <Suspense
                fallback={
                    <>
                        <Preloader />
                    </>
                }>
                <Routes>
                    {/* <Route path='/' element={} /> */}
                    {/* <Route path='/login' element={<LoginPage />} /> */}

                    <Route element={<DashboardLayout />}>
                        <Route path='/' element={<DashboardHome />} />
                        <Route path='admins' element={<DashboardAdmins />} />
                        <Route path='workers' element={<DashboardWorkers />} />
                        <Route path='profile' element={<DashboardProfile />} />
                    </Route>
                    <Route path='/loader' element={<Preloader />} />
                    <Route path='*' element={<h1>Page Not Found</h1>} />
                </Routes>
            </Suspense>
        </>
    );
};

export default App;
