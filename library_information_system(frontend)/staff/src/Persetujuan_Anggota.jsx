import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import NavBarComponent from "./components/NavBarComponent";
import UserNav from "./components/UserNav";

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

function Persetujuan_Anggota() {
  const [NavOpen, setIsNavOpen] = useState(true);
  const [showPengelolaanDropdown, setShowPengelolaanDropdown] = useState(false);
  const [showAnggotaDropdown, setShowAnggotaDropdown] = useState(false);
  const [showPengelolaanStaff, setStaff] = useState(false);
  const [allDataAnggota, setAllDataAnggota] = useState([]); // Menyimpan semua data anggota
  const [searchTerm, setSearchTerm] = useState("");

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

  const togglePengelolaanStaff = () => {
    setStaff(!showPengelolaanStaff);
  };

  const toggleAnggotaDropdown = () => {
    setShowAnggotaDropdown(!showAnggotaDropdown);
  };

  const togglePengelolaanDropdown = () => {
    setShowPengelolaanDropdown(!showPengelolaanDropdown);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`${Cookies.get('access')}/students/sh`);
        setAllDataAnggota(response.data); // Simpan semua data anggota
        console.log("Data persetujuan anggota berhasil diambil:", response.data);
      } catch (error) {
        console.error("Gagal mengambil data persetujuan anggota:", error);
      }
    };

    fetchData();
  }, []);

  // Filter data hanya yang berstatus 'pending' dan sesuai dengan pencarian
  const filteredDataAnggota = allDataAnggota.filter((anggota) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      anggota.status?.toLowerCase() === 'pending' &&
      (anggota.name?.toLowerCase().includes(searchLower) ||
        anggota.email?.toLowerCase().includes(searchLower) ||
        anggota.no_telepon?.toLowerCase().includes(searchLower) ||
        anggota.tanggal_daftar?.toLowerCase().includes(searchLower))
    );
  });

  const handleTerima = async (id_siswa) => {
    try {
      await api.put(`/${Cookies.get('access')}/updateStatusSiswa/${id_siswa}`, { status: 'approved' });
      // Setelah berhasil menerima, ambil ulang data anggota
      const response = await api.get(`${Cookies.get('access')}/students/sh`);
      setAllDataAnggota(response.data);
      console.log(`Anggota dengan ID: ${id_siswa} disetujui.`);
    } catch (error) {
      console.error("Gagal menyetujui anggota:", error);
    }
  };

  const handleTolak = async (id_siswa) => {
    try {
      await api.put(`/${Cookies.get('access')}/updateStatusSiswa/${id_siswa}`, { status: 'rejected' });
      // Setelah berhasil menolak, ambil ulang data anggota
      const response = await api.get(`${Cookies.get('access')}/students/sh`);
      setAllDataAnggota(response.data);
      console.log(`Anggota dengan ID: ${id_siswa} ditolak.`);
    } catch (error) {
      console.error("Gagal menolak anggota:", error);
    }
  };

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
              <div className="max-w-full w-6xl my-0 mx-auto bg-white h-full py-2">
                <div className="w-full h-20 rounded-md flex items-center justify-between mb-1">
                  <h1 className="font-semibold text-2xl">
                    Persetujuan Anggota Perpustakaan
                  </h1>
                  <div className="w-1/2 flex items-center relative">
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-[50%] h-8 border-1 border-slate-300 rounded-2xl pl-2 pr-8 outline-1 outline-gray-300"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    <i className="bx bx-x absolute left-48 top-2.5 text-xl"></i>
                    <button className="py-1 mt-[4px] ml-3 text-xl rounded-2xl cursor-pointer">
                      <i className="bx bx-search"></i>
                    </button>
                  </div>
                </div>
                <div className="w-full h-75 scroll">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr className="bg-gray-600 text-white">
                        <th className="py-2 px-4 border-b">No</th>
                        <th className="py-2 px-4 border-b">Nama Anggota</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">No. Telp</th>
                        <th className="py-2 px-4 border-b">
                          Tanggal Pendaftaran
                        </th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Ket</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDataAnggota.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-4 px-4 text-center">
                            Data Kosong
                          </td>
                        </tr>
                      ) : (filteredDataAnggota.map((anggota, index) => (
                        <tr key={anggota.id_siswa} className="hover:bg-gray-100">
                          <td className="py-2 px-4 border-b text-center">
                            {index + 1}
                          </td>
                          <td className="py-2 px-4 border-b">{anggota.name}</td>
                          <td className="py-2 px-4 border-b">{anggota.email}</td>
                          <td className="py-2 px-4 border-b">
                            {anggota.no_telepon}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {formatDate(anggota.tanggal_daftar)}
                          </td>
                          <td className="py-2 px-4 border-b">{anggota.status}</td>
                          <td className="py-2 px-4 border-b">
                            {anggota.status?.toLowerCase() === 'pending' ? (
                              <div className="flex gap-2">
                                <button
                                  className="bg-green-400 px-2 py-1 rounded-md text-white hover:bg-green-600"
                                  onClick={() => handleTerima(anggota.id_siswa)}
                                >
                                  Terima
                                </button>
                                <button
                                  className="bg-red-400 px-2 py-1 rounded-md text-white hover:bg-red-600"
                                  onClick={() => handleTolak(anggota.id_siswa)}
                                >
                                  Tolak
                                </button>
                              </div>
                            ) : (
                              <span
                                className={`px-2 py-1 rounded-md text-white ${anggota.status === "rejected" ? "bg-red-500" : "bg-green-500"
                                  }`}
                              >
                                {anggota.status === "rejected" ? "Ditolak" : "Disetujui"}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                      )}
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

export default Persetujuan_Anggota;