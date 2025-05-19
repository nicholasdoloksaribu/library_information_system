import "./App.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBarComponent from "./components/NavBarComponent";
import UserNav from "./components/UserNav";
import Cookies from 'js-cookie';
import axios from "axios";
import { jsPDF } from 'jspdf';
import autoTable from "jspdf-autotable";

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

function Detail_Peminjaman() {
  const [NavOpen, setIsNavOpen] = useState(true);
  const [showPengelolaanDropdown, setShowPengelolaanDropdown] = useState(false);
  const [showAnggotaDropdown, setShowAnggotaDropdown] = useState(false);
  const [showEditBook, setShowEditBook] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [dataPeminjaman, setDataPeminjaman] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPinjam, setFilterPinjam] = useState({ start: "", end: "" });
  const [filterKembali, setFilterKembali] = useState({ start: "", end: "" });

  const handleDatePinjamChange = (event, type) => {
    setFilterPinjam({ ...filterPinjam, [type]: event.target.value });
  };

  const handleDateKembaliChange = (event, type) => {
    setFilterKembali({ ...filterKembali, [type]: event.target.value });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`${Cookies.get('access')}/borrowings`);
        setDataPeminjaman(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data peminjaman:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleEditBook = (peminjaman) => {
    setSelectedBook(peminjaman);
    setShowEditBook(!showEditBook);
  };

  const togglePengelolaanDropdown = () => {
    setShowPengelolaanDropdown(!showPengelolaanDropdown);
  };

  const navigate = useNavigate();

  const handleDelete = async (id_peminjaman, id_siswa, kode_buku) => {
    try {
      await api.delete(`/${Cookies.get('access')}/borrowings/${id_siswa}/${kode_buku}`);
      const updatedData = dataPeminjaman.filter(
        (peminjaman) => peminjaman.id_peminjaman !== id_peminjaman
      );
      setDataPeminjaman(updatedData);
    } catch (error) {
      console.error(
        `Gagal menghapus data peminjaman:`,
        error
      );
    }
  };

  const handleUpdatePeminjaman = async (event) => {
    event.preventDefault();

    if (!selectedBook) {
      console.error("Tidak ada data peminjaman yang dipilih untuk diupdate.");
      return;
    }

    const { id_siswa, kode_buku } = selectedBook;

    try {
      console.log(`/${Cookies.get('access')}/borrowings/${selectedBook.id_peminjaman}/${selectedBook.kode_buku}`)
      const response = await api.put(
        `/${Cookies.get('access')}/borrowings/${selectedBook.id_peminjaman}/${selectedBook.kode_buku}`,
        {
          status: selectedBook.status,
          tanggal_pinjam: selectedBook.tanggal_pinjam,
          tanggal_pengembalian: selectedBook.tanggal_pengembalian,
        }
      );
      console.log(response)
      alert('Peminjaman berhasil diupdate')
      setShowEditBook(false);
    } catch (error) {
      console.error("Gagal mengupdate peminjaman:", error);
      alert("Gagal mengupdate peminjaman.");
    }
  };

  const filteredDataPeminjaman = dataPeminjaman.filter((peminjaman) => {
    const searchLower = searchTerm.toLowerCase();
    const isNotPending = peminjaman.status?.toLowerCase() !== 'pending';
    return isNotPending && (
      peminjaman.student?.name?.toLowerCase().includes(searchLower) ||
      peminjaman.book?.judul?.toLowerCase().includes(searchLower) ||
      peminjaman.status?.toLowerCase().includes(searchLower) ||
      peminjaman.tanggal_pinjam?.toLowerCase().includes(searchLower) ||
      peminjaman.tanggal_pengembalian?.toLowerCase().includes(searchLower)
    );
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    autoTable(doc, { // Gunakan autoTable sebagai fungsi yang menerima doc
      head: [['No', 'Nama Peminjam', 'Judul Buku', 'Tanggal Pinjam', 'Tanggal Kembali', 'Status']],
      body: filteredDataPeminjaman.map((peminjaman, index) => [
        index + 1,
        peminjaman.student?.name,
        peminjaman.book?.judul,
        peminjaman.tanggal_pinjam,
        peminjaman.tanggal_pengembalian,
        peminjaman.status,
      ]),
      startY: 20,
    });
    doc.save(`data_peminjaman_${new Date().toLocaleDateString()}.pdf`);
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
            <section className="container h-full flex flex-col">
              <div className="max-w-full w-4xl my-0 mx-auto h-full py-2 flex flex-col">
                {!showEditBook && (
                  <div className="flex mb-3 h-8 justify-between mr-5 gap-x-6 items-center">
                    <div className="w-120 gap-x-3 items-center flex relative">
                      <h1 className="text-xl font-bold">Detail Peminjaman</h1>
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-[40%] border-1 border-slate-300 rounded-2xl pl-2 pr-8 outline-1 outline-gray-300"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                      <i className="bx bx-x absolute right-27.5 top-2 text-xl"></i>
                      <button className="py-1 mt-[1px] text-xl rounded-2xl cursor-pointer">
                        <i className="bx bx-search"></i>
                      </button>
                    </div>
                    <div className="flex gap-2 items-center">
                      
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                        onClick={generatePDF}
                      >
                        Print PDF
                      </button>
                    </div>
                  </div>
                )}
                {!showEditBook && (
                  <div className="flex-grow w-full overflow-auto rounded-xl">
                    <table className="min-w-full bg-white border border-gray-300">
                      <thead className="sticky top-0">
                        <tr className="bg-gray-600 text-white">
                          <th className="py-2 px-4 border-b">No</th>
                          <th className="py-2 px-4 border-b">Nama Peminjam</th>
                          <th className="py-2 px-4 border-b">Judul Buku</th>
                          <th className="py-2 px-4 border-b">
                            Tanggal Peminjaman
                          </th>
                          <th className="py-2 px-4 border-b">
                            Tanggal Pengembalian
                          </th>
                          <th className="py-2 px-4 border-b">Status</th>
                          <th className="py-2 px-4 border-b">Ket</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDataPeminjaman.map((peminjaman, index) => (
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
                                  className="text-blue-500 hover:text-blue-700 mr-2"
                                  onClick={() => toggleEditBook(peminjaman)}
                                >
                                  <i className="bx bxs-edit text-xl" title="Edit"></i>
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDelete(peminjaman.id_peminjaman, peminjaman.id_siswa, peminjaman.kode_buku)}
                                >
                                  <i className="bx bx-block text-xl" title="Delete"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {showEditBook && (
                  <div className="flex-grow container">
                    <h1
                      className={`text-2xl font-bold p-2 ${NavOpen ? "" : "ml-2"
                        }`}
                    >
                      Edit Peminjaman
                    </h1>
                    <form className="w-full h-full pt-2 pb-2 overflow-auto rounded-md border-1 border-slate-200 shadow-md" onSubmit={handleUpdatePeminjaman}>
                      <div className="mb-2 px-4">
                        <label className="block text-sm font-medium mb-1">
                          Nama Peminjam
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="Masukkan nama peminjam"
                          value={selectedBook?.student?.name || ""} // Akses nama siswa
                          onChange={(e) =>
                            setSelectedBook({
                              ...selectedBook,
                              student: { ...selectedBook?.student, name: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="mb-2 px-4">
                        <label className="block text-sm font-medium mb-1">
                          Judul Buku
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="Masukkan judul buku"
                          value={selectedBook?.book?.judul || ""} // Akses judul buku
                          onChange={(e) =>
                            setSelectedBook({
                              ...selectedBook,
                              book: { ...selectedBook?.book, judul: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="mb-2 px-4">
                        <label className="block text-sm font-medium mb-1">
                          Tanggal Peminjaman
                        </label>
                        <input
                          type="date"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={selectedBook?.tanggal_pinjam || ""}
                          onChange={(e) =>
                            setSelectedBook({
                              ...selectedBook,
                              tanggal_pinjam: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-2 px-4">
                        <label className="block text-sm font-medium mb-1">
                          Tanggal Pengembalian
                        </label>
                        <input
                          type="date"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={selectedBook?.tanggal_pengembalian || ""}
                          onChange={(e) =>
                            setSelectedBook({
                              ...selectedBook,
                              tanggal_pengembalian: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-2 px-4">
                        <label className="block text-sm font-medium mb-1">
                          Status
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded"
                          value={selectedBook?.status || ""}
                          onChange={(e) =>
                            setSelectedBook({
                              ...selectedBook,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="dipinjam">Dipinjam</option>
                          <option value="dikembalikan">Dikembalikan</option>
                          <option value="pending">Pending</option>
                          <option value="ditolak">Ditolak</option>
                          <option value="telat">Telat</option>
                        </select>
                      </div>
                      <div className="flex gap-2 px-4">
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-4 py-1 rounded"
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowEditBook(false)}
                          className="bg-gray-500 text-white px-4 py-1 rounded"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </section>
    </>
  );
}

export default Detail_Peminjaman;