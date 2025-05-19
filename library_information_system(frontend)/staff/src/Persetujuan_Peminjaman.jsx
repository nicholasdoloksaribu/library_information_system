import "./App.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

function Persetujuan_Peminjaman() {
  const [NavOpen, setIsNavOpen] = useState(true);
  const [showPengelolaanDropdown, setShowPengelolaanDropdown] = useState(false);
  const [showAnggotaDropdown, setShowAnggotaDropdown] = useState(false);
  const [allDataPersetujuan, setAllDataPersetujuan] = useState([]); // Menyimpan semua data dari API
  const [searchTerm, setSearchTerm] = useState("");

  const toggleAnggotaDropdown = () => {
    setShowAnggotaDropdown(!showAnggotaDropdown);
  };

  const togglePengelolaanDropdown = () => {
    setShowPengelolaanDropdown(!showPengelolaanDropdown);
  };

  const navigate = useNavigate();

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`${Cookies.get('access')}/borrowings`);
        setAllDataPersetujuan(response.data.data); // Simpan semua data yang diterima
      } catch (error) {
        console.error("Gagal mengambil data persetujuan peminjaman:", error);
      }
    };

    fetchData();
  }, []);

  // Filter data hanya yang berstatus 'pending' dan sesuai dengan pencarian
  const filteredDataPersetujuan = allDataPersetujuan.filter((peminjaman) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      peminjaman.status?.toLowerCase() === 'pending' &&
      (peminjaman.student?.name?.toLowerCase().includes(searchLower) ||
        peminjaman.book?.judul?.toLowerCase().includes(searchLower))
    );
  });

  const handleTerima = async (id_peminjaman, kode_buku) => {
    try {
      console.log(id_peminjaman, kode_buku)
      await api.put(`/${Cookies.get('access')}/updateStatusPeminjaman/${id_peminjaman}/${kode_buku}`, { status: 'dipinjam' });
      // Setelah berhasil menerima, lakukan pembaruan data (ambil ulang semua data)
      const response = await api.get(`${Cookies.get('access')}/borrowings`);
      setAllDataPersetujuan(response.data.data);
      console.log(`Peminjaman dengan ID: ${id_peminjaman} dan Kode Buku: ${kode_buku} diterima.`);
    } catch (error) {
      console.error("Gagal menerima peminjaman:", error);
    }
  };

  const handleTolak = async (id_peminjaman, kode_buku) => {
    try {
      await api.put(`/${Cookies.get('access')}/updateStatusPeminjaman/${id_peminjaman}/${kode_buku}`, { status: 'ditolak' });
      // Setelah berhasil menolak, lakukan pembaruan data (ambil ulang semua data)
      const response = await api.get(`${Cookies.get('access')}/borrowings`);
      setAllDataPersetujuan(response.data.data);
      console.log(`Peminjaman dengan ID: ${id_peminjaman} dan Kode Buku: ${kode_buku} ditolak.`);
    } catch (error) {
      console.error("Gagal menolak peminjaman:", error);
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

          <main className="h-full overflow-auto flex-3">
            <UserNav></UserNav>
            <section className="container h-full overflow-auto flex flex-col">
              <div className="max-w-full w-4xl my-0 mx-auto h-full py-2 flex flex-col">
                <div className="flex mb-3 h-8 justify-between mr-5 gap-x-6 items-center">
                  <div className="w-120 gap-x-3 items-center flex relative">
                    <h1 className="text-xl font-bold">Persetujuan Peminjaman</h1>
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-[40%] border-1 border-slate-300 rounded-2xl pl-2 pr-8 outline-1 outline-gray-300"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    <i className="bx bx-x absolute right-12 top-2 text-xl"></i>
                    <button className="py-1 mt-[1px] text-xl rounded-2xl cursor-pointer">
                      <i className="bx bx-search"></i>
                    </button>
                  </div>
                  {/* Tanggal dihapus */}
                </div>
                <div className="flex-grow w-full overflow-auto rounded-xl">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead className="sticky top-0">
                      <tr className="bg-gray-600 text-white">
                        <th className="py-2 px-4 border-b">No</th>
                        <th className="py-2 px-4 border-b">Nama Peminjam</th>
                        <th className="py-2 px-4 border-b">Judul Buku</th>
                        <th className="py-2 px-4 border-b">Tanggal Peminjaman</th>
                        <th className="py-2 px-4 border-b">Tanggal Pengembalian</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Ket</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDataPersetujuan.map((peminjaman, index) => (
                        <tr key={peminjaman.id_peminjaman} className="hover:bg-gray-100">
                          <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                          <td className="py-2 px-4 border-b">{peminjaman.student?.name}</td>
                          <td className="py-2 px-4 border-b">{peminjaman.book?.judul}</td>
                          <td className="py-2 px-4 border-b">{peminjaman.tanggal_pinjam}</td>
                          <td className="py-2 px-4 border-b">{peminjaman.tanggal_pengembalian}</td>
                          <td className="py-2 px-4 border-b">{peminjaman.status}</td>
                          <td className="py-2 px-4 border-b">
                            <div className="flex gap-2">
                              <button
                                className="bg-green-400 px-2 py-1 rounded-md text-white hover:bg-green-600"
                                onClick={() => handleTerima(peminjaman.id_peminjaman, peminjaman.book.kode_buku)}
                              >
                                Terima
                              </button>
                              <button
                                className="bg-red-400 px-2 py-1 rounded-md text-white hover:bg-red-600"
                                onClick={() => handleTolak(peminjaman.id_peminjaman, peminjaman.book.kode_buku)}
                              >
                                Tolak
                              </button>
                            </div>
                          </td>
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

export default Persetujuan_Peminjaman;