import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const DashboardAdmins = () => {
    const [admins, setAdmins] = useState([]);

    // useEffect(() => {
    //     try {
    //         const resposne = axios.get(`${baseURL}/admins`, {
    //             withCredentials: true,
    //         });

    //         if (resposne.status === 200) {
    //             setAdmins(resposne.data.admins);
    //         } else {
    //             setAdmins("EROOOOOOR");
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }, []);

    useEffect(() => {
        document.title = "WorkCheck - Dashboard | Adminlar";
    }, []);

    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    return (
        <div>
            {/* {admins?.map((admin) => (
                <div>{admin?.username}</div>
            ))} */}
            <h2>{t("dashboard_admins")}</h2>
            <button
                onClick={() => changeLanguage("en")}
                className='border rounded-lg p-2'>
                {t("ui.change_language")}
            </button>
            <button
                onClick={() => changeLanguage("ru")}
                className='border rounded-lg p-2'>
                {t("ui.change_language")}
            </button>
            <button
                onClick={() => changeLanguage("uz")}
                className='border rounded-lg p-2'>
                {t("ui.change_language")}
            </button>
            <h1>{t("hello")}</h1>
        </div>
    );
};

export default DashboardAdmins;
