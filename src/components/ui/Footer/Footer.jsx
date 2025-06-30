import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className='bg-white dark:bg-[#111] dark:text-white p-4 rounded-lg mt-2.5 sticky bottom-0'>
            Sayt yaratuvchiSUUUUIII{" "}
            <Link to={"https://limon.uz"} target='_blank'>
                Limon.uz
            </Link>
        </div>
    );
};

export default Footer;
