import { useState, useEffect } from "react";
import { fetchData } from "../../utils/api";

export default function Kartu({judul, icon, nilai}){

    return(
        <>
            <div className="h-full bg-slate-700 flex-1 rounded-xl flex justify-center items-center text-slate-200">
                <i className={`bx bx-${icon} text-4xl mr-2`}></i>
                <p className="font-semibold">{judul} <span>{nilai}</span></p>
            </div>
        </>
    )
}