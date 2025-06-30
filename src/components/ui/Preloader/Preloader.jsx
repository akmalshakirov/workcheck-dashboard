import { useTranslation } from "react-i18next";
import "./Preloader.css";

const Preloader = () => {
    const dark = localStorage.getItem("isDark");
    const isDark = dark == "true";
    const { t } = useTranslation();
    return (
        <div
            className={`preloader ${
                isDark ? "bg-black text-[#f1f1f1]" : "bg-[#5f73e3] text-white"
            }`}>
            <div className='loader'></div>
            <h1>{t("preloader")}</h1>
        </div>
    );
};

export default Preloader;
