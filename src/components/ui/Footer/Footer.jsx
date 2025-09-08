import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const Footer = ({ collapsed }) => {
    const { t } = useTranslation();
    return (
        <footer
            className={`bg-white shadow-2xl shadow-black dark:bg-[#111] dark:text-white p-4 rounded-lg mt-2.5 fixed ${
                collapsed
                    ? "w-[91.44%] 2xl:w-[93.8%]"
                    : "w-[75.6%] 2xl:w-[82.6%]"
            } bottom-3`}>
            {t("footer_creator")}:{" "}
            <Link to={"https://limon.uz"} target='_blank'>
                Limon.uz
            </Link>
        </footer>
    );
};
