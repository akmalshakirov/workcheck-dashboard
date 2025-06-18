import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import DashboardAdmins from "./pages/Dashboard/DashboardAdmins";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import DashboardProfile from "./pages/Dashboard/DashboardProfile";
import DashboardWorkers from "./pages/Dashboard/DashboardWorkers";

const App = () => {
    return (
        <>
            <Routes>
                {/* <Route path='/' element={} /> */}
                {/* <Route path='/login' element={<LoginPage />} /> */}

                <Route element={<DashboardLayout />}>
                    <Route path='/' element={<DashboardHome />} />
                    <Route path='admins' element={<DashboardAdmins />} />
                    <Route path='workers' element={<DashboardWorkers />} />
                    <Route path='profile' element={<DashboardProfile />} />
                </Route>
                <Route path='*' element={<h1>Page Not Found</h1>} />
            </Routes>
        </>
    );
};

export default App;
