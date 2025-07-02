import { t } from "i18next";
import React from "react";
import "./Loader.css";

const Loader = () => {
    return (
        <div className='flex items-center justify-center w-screen h-screen relative'>
            <div class='spinner center'>
                <div class='spinner-blade'></div>
                <div class='spinner-blade'></div>
                <div class='spinner-blade'></div>
                <div class='spinner-blade'></div>
                <div class='spinner-blade'></div>
                <div class='spinner-blade'></div>
                <div class='spinner-blade'></div>
                <div class='spinner-blade'></div>
                <div class='spinner-blade'></div>
                <div class='spinner-blade'></div>
                <div class='spinner-blade'></div>
                <div class='spinner-blade'></div>
            </div>
            <h1>{t("preloader")}</h1>
        </div>
    );
};

export default Loader;
