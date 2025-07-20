import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";
import "./i18n.js";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <AdminProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AdminProvider>
);
