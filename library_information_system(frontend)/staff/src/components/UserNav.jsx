import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { fetchData } from '../utils/api';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function UserNav() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [profil, setProfil] = useState(null);
    const token = Cookies.get('access_token');

    useEffect(() => {
        const fetchNama = async () => {
            try {
                const result = await axios.get(`${API_URL}/api/${Cookies.get('access')}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setProfil(result.data);
            } catch (error) {
                console.error("Gagal mengambil data profil:", error);
            }
        };
        fetchNama();
    }, [token]);

    return (
        <>
            <header className="bg-slate-700 h-16 relative">
                <div className="absolute right-9 bottom-3 flex items-center gap-x-2">
                    <img
                        src="/download.jpeg"
                        alt="Profil"
                        className="w-10 h-10 rounded-3xl"
                    />
                    <span className="font-semibold text-white text-sm">
                        {profil && profil.name}
                    </span>
                </div>
            </header>
        </>
    );
}