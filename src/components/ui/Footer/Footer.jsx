import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
    const { t } = useTranslation();
    return (
        <div className='bg-white dark:bg-[#111] dark:text-white p-4 rounded-lg mt-2.5 sticky bottom-0'>
            {t("footer_creator")}:{" "}
            <Link to={"https://limon.uz"} target='_blank'>
                Limon.uz
            </Link>
        </div>
    );
};

export default Footer;
