import "./App.css";
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import NavBarComponent from "./components/NavBarComponent";
import UserNav from "./components/UserNav";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: `${API_URL}/api`,
});

api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

function Data_HeadPerpustakaan() {
    const [searchTerm, setSearchTerm] = useState("");
    const [headPerpustakaanData, setHeadPerpustakaanData] = useState([]);

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const day = date.getDate();
        const monthNames = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        return `${day} ${monthNames[monthIndex]} ${year}`;
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        const fetchHeadPerpustakaanData = async () => {
            try {
                const response = await api.get(`/headperpustakaan`);
                setHeadPerpustakaanData(Array.isArray(response.data) ? response.data : [response.data]);
                console.log("Data head perpustakaan berhasil diambil:", response.data);
            } catch (error) {
                console.error("Gagal mengambil data head perpustakaan:", error);
            }
        };

        fetchHeadPerpustakaanData();
    }, []);

    const filteredHeadPerpustakaanData = headPerpustakaanData.filter((head) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            head?.name?.toLowerCase().includes(searchLower) ||
            head?.email?.toLowerCase().includes(searchLower) ||
            head?.no_telepon?.toLowerCase().includes(searchLower) ||
            head?.created_at?.toLowerCase().includes(searchLower)
        );
    });

    const generatePDF = useCallback((data) => {
        const doc = new jsPDF();
        doc.text("Data Head Perpustakaan", 10, 10);

        const head = [['No', 'Nama', 'Email', 'No. Telepon', 'Tanggal Daftar']];
        const body = data.map((head, index) => [
            index + 1,
            head?.name,
            head?.email,
            head?.no_telepon,
            head?.created_at ? formatDate(head.created_at) : '-',
        ]);

        autoTable(doc, {
            head: head,
            body: body,
            startY: 20,
        });

        doc.save(`data_head_perpustakaan_${new Date().toLocaleDateString()}.pdf`);
    }, []);

    return (
        <>
            <section className="h-screen">
                <link
                    href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
                    rel="stylesheet"
                ></link>

                <div className="w-full h-full flex relative">
                    <NavBarComponent></NavBarComponent>

                    <main className="h-full flex-3">
                        <UserNav></UserNav>
                        <section className="container h-box">
                            <div className="max-w-full w-4xl my-0 mx-auto bg-white h-full py-2">
                                <div className="w-full h-20 rounded-md flex items-center justify-between mb-1">
                                    <h1 className="font-semibold text-2xl">Data Head Perpustakaan</h1>
                                    <div className="w-full flex items-center justify-between">
                                        <div className="w-1/2 flex items-center relative">
                                            <input
                                                type="text"
                                                placeholder="Search"
                                                className="w-[70%] h-8 border-1 border-slate-300 rounded-2xl pl-2 pr-8 outline-1 outline-gray-300"
                                                value={searchTerm}
                                                onChange={handleSearch}
                                            />
                                            <i className="bx bx-x absolute left-[60%] top-2.5 text-xl"></i>
                                            <button className="py-1 mt-[4px] ml-3 text-xl rounded-2xl cursor-pointer">
                                                <i className="bx bx-search"></i>
                                            </button>
                                        </div>
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                            onClick={() => generatePDF(filteredHeadPerpustakaanData)}
                                        >
                                            Export to PDF
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full h-75 scroll">
                                    <table className="min-w-full bg-white border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-600 text-white">
                                                <th className="py-2 px-4 border-b">No</th>
                                                <th className="py-2 px-4 border-b">Nama</th>
                                                <th className="py-2 px-4 border-b">Email</th>
                                                <th className="py-2 px-4 border-b">No. Telepon</th>
                                                <th className="py-2 px-4 border-b">Tanggal Daftar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredHeadPerpustakaanData.map((head, index) => (
                                                <tr key={head?.id} className="hover:bg-gray-100">
                                                    <td className="py-2 px-4 border-b text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td className="py-2 px-4 border-b">{head?.name}</td>
                                                    <td className="py-2 px-4 border-b">{head?.email}</td>
                                                    <td className="py-2 px-4 border-b">{head?.no_telepon}</td>
                                                    <td className="py-2 px-4 border-b">{head?.created_at ? formatDate(head.created_at) : '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </section>
        </>
    );
}

export default Data_HeadPerpustakaan;