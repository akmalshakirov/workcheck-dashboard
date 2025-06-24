import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className='bg-white p-4 rounded-lg mt-2.5'>
            Sayt yaratuvchiSUUUUIII{" "}
            <Link to={"https://limon.uz"} target='_blank'>
                Limon.uz
            </Link>
        </div>
    );
};

export default Footer;
