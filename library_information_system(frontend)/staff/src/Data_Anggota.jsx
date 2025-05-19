import "./App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

function Data_Siswa() {
  const [NavOpen, setIsNavOpen] = useState(true);
  const [showPengelolaanDropdown, setShowPengelolaanDropdown] = useState(false);
  const [showAnggotaDropdown, setShowAnggotaDropdown] = useState(false);
  const [showPengelolaanSiswa, setSiswa] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [siswaData, setSiswaData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSiswa, setNewSiswa] = useState({
    name: "",
    email: "",
    no_telepon: "",
    status: "Pending",
    foto_profil: null,
    password: "",
    password_confirmation: "",
  });
  const [editSiswa, setEditSiswa] = useState({
    name: "",
    email: "",
    no_telepon: "",
    status: "",
    foto_profil: null,
    password: "",
    password_confirmation: "",
  });
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const userAbility = Cookies.get('access');

  const togglePengelolaanSiswa = () => {
    setSiswa(!showPengelolaanSiswa);
  };

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

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const day = date.getDate();
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    return `${day} ${monthNames[monthIndex]} ${year}`;
  };

  useEffect(() => {
    const fetchSiswaData = async () => {
      try {
        const response = await api.get(`/${userAbility}/students/sh`);
        setSiswaData(response.data);
        console.log("Data siswa berhasil diambil:", response.data);
      } catch (error) {
        console.error("Gagal mengambil Data Siswa:", error);
      }
    };

    fetchSiswaData();
  }, []);

  const filteredSiswaData = siswaData.filter((siswa) => {
    const searchLower = searchTerm.toLowerCase();
    const isApproved = siswa.status?.toLowerCase() === 'approved';
    return isApproved && (
      siswa.kode_siswa?.toLowerCase().includes(searchLower) ||
      siswa.name?.toLowerCase().includes(searchLower) ||
      siswa.email?.toLowerCase().includes(searchLower) ||
      siswa.no_telepon?.toLowerCase().includes(searchLower)
    );
  });

  const generatePDF = (siswaData) => {
    const doc = new jsPDF();
    doc.text("Data Siswa", 10, 10);

    const head = [["No", "Nama Siswa", "Email", "No. Telp", "Status"]];
    const body = siswaData.map((siswa, index) => [
      index + 1,
      siswa.name,
      siswa.email,
      siswa.no_telepon,
      siswa.status,
    ]);

    autoTable(doc, {
      head: head,
      body: body,
      startY: 20,
    });

    doc.save(`data_siswa_${new Date().toLocaleDateString()}.pdf`);
  };

  const handleEditClick = (siswa) => {
    setSelectedSiswa(siswa);
    setEditSiswa({
      name: siswa.name,
      email: siswa.email,
      no_telepon: siswa.no_telepon,
      status: siswa.status,
      foto_profil: siswa.foto_profil,
      password: "",
      password_confirmation: "",
    });
    setShowEditForm(true);
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    if (editSiswa.password !== editSiswa.password_confirmation) {
      setPasswordMatchError("Konfirmasi password tidak sesuai.");
      return;
    }
    setPasswordMatchError("");
    try {
      const formData = new FormData();
      formData.append('name', editSiswa.name);
      formData.append('email', editSiswa.email);
      formData.append('no_telepon', editSiswa.no_telepon);
      formData.append('status', editSiswa.status);
      if (editSiswa.foto_profil instanceof File) {
        formData.append('foto_profil', editSiswa.foto_profil);
      } else if (typeof editSiswa.foto_profil === 'string' && editSiswa.foto_profil) {
        formData.append('old_foto_profil', editSiswa.foto_profil);
      }
      if (editSiswa.password) {
        formData.append('password', editSiswa.password);
        formData.append('password_confirmation', editSiswa.password_confirmation);
      }

      const response = await api.post(`/${userAbility}/student/${selectedSiswa.id_siswa}/edit-profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Data Siswa berhasil diubah:", response.data);
      setShowEditForm(false);
      const fetchSiswaData = async () => {
        try {
          const response = await api.get(`/${userAbility}/students/sh`);
          setSiswaData(response.data);
          console.log("Data siswa berhasil diambil:", response.data);
        } catch (error) {
          console.error("Gagal mengambil Data Siswa:", error);
        }
      };
      fetchSiswaData();
    } catch (error) {
      console.error("Gagal mengubah Data Siswa:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus siswa ini?")) {
      try {
        await api.delete(`/${userAbility}/students/${id}`);
        console.log(`Siswa dengan ID ${id} berhasil dihapus.`);
        const fetchSiswaData = async () => {
          try {
            const response = await api.get(`/${userAbility}/students/sh`);
            setSiswaData(response.data);
            console.log("Data siswa berhasil diambil:", response.data);
          } catch (error) {
            console.error("Gagal mengambil Data Siswa:", error);
          }
        };
        fetchSiswaData();
      } catch (error) {
        console.error("Gagal menghapus siswa:", error);
      }
    }
  };

  const handleHistoryClick = (siswa) => {
    setSelectedSiswa(siswa);
    setShowActivity(true);
  };

  const closeActivity = () => {
    setShowActivity(false);
    setSelectedSiswa(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setNewSiswa({
      ...newSiswa,
      [name]: type === 'file' ? files[0] : value,
    });
    setPasswordMatchError(""); // Clear error on input change
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    if (newSiswa.password !== newSiswa.password_confirmation) {
      setPasswordMatchError("Konfirmasi password tidak sesuai.");
      return;
    }
    setPasswordMatchError("");
    try {
      const formData = new FormData();
      formData.append('name', newSiswa.name);
      formData.append('email', newSiswa.email);
      formData.append('no_telepon', newSiswa.no_telepon);
      formData.append('status', newSiswa.status.toLowerCase());
      if (newSiswa.foto_profil) {
        formData.append('foto_profil', newSiswa.foto_profil);
      }
      formData.append('password', newSiswa.password);
      formData.append('password_confirmation', newSiswa.password_confirmation); // Send confirmation
      console.log("Isi FormData:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const response = await api.post(`/${userAbility}/students/st`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Siswa berhasil ditambahkan:", response.data);
      setShowAddForm(false);
      setNewSiswa({
        name: "",
        email: "",
        no_telepon: "",
        status: "Pending",
        foto_profil: null,
        password: "",
        password_confirmation: "",
      });
      const fetchSiswaData = async () => {
        try {
          const response = await api.get(`/${userAbility}/students/sh`);
          setSiswaData(response.data);
          console.log("Data siswa berhasil diambil:", response.data);
        } catch (error) {
          console.error("Gagal mengambil Data Siswa:", error);
        }
      };
      fetchSiswaData();
    } catch (error) {
      console.error("Gagal menambahkan siswa:", error);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setEditSiswa({
      ...editSiswa,
      [name]: type === 'file' ? files[0] : value,
    });
    setPasswordMatchError(""); // Clear error on input change
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
            <section className="container h-full flex flex-col">
              {!showActivity && !showEditForm && !showAddForm && (
                <div className="max-w-full w-6xl my-0 mx-auto bg-white h-full py-2 flex flex-col">
                  <div className="flex justify-end mb-2">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                      onClick={() => setShowAddForm(true)}
                    >
                      Tambah Siswa
                    </button>
                  </div>
                  <div className="flex justify-end mb-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      onClick={() => generatePDF(filteredSiswaData)}
                    >
                      Print PDF
                    </button>
                  </div>
                  <div className="w-full h-20 rounded-md flex items-center justify-between mb-1">
                    <h1 className="font-semibold text-2xl">Data Siswa</h1>
                    <div className="w-1/2 flex items-center relative">
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-[40%] h-8 border-1 border-slate-300 rounded-2xl pl-2 pr-8 outline-1 outline-gray-300"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                      <i className="bx bx-x absolute left-38 top-2.5 text-xl"></i>
                      <button className="py-1 mt-[4px] ml-3 text-xl rounded-2xl cursor-pointer">
                        <i className="bx bx-search"></i>
                      </button>
                    </div>
                  </div>
                  <div className="flex-grow w-full overflow-auto rounded-xl">
                    <table className="min-w-full bg-white border border-gray-300">
                      <thead>
                        <tr className="bg-gray-600 text-white">
                          <th className="py-2 px-4 border-b">No</th>
                          <th className="py-2 px-4 border-b">Nama Siswa</th>
                          <th className="py-2 px-4 border-b">Email</th>
                          <th className="py-2 px-4 border-b">No. Telp</th>
                          <th className="py-2 px-4 border-b">Status</th>
                          <th className="py-2 px-4 border-b">Ket</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSiswaData.map((siswa, index) => (
                          <tr key={siswa.id_siswa} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b text-center">
                              {index + 1}
                            </td>
                            <td className="py-2 px-4 border-b">{siswa.name}</td>
                            <td className="py-2 px-4 border-b">{siswa.email}</td>
                            <td className="py-2 px-4 border-b">{siswa.no_telepon}</td>
                            <td className="py-2 px-4 border-b">{siswa.status}</td>
                            <td className="py-2 px-4 border-b">
                              <div className="flex gap-2">
                                <button
                                  className="text-blue-500 hover:text-blue-700 mr-2"
                                  onClick={() => handleEditClick(siswa)}
                                >
                                  <i
                                    className="bx bxs-edit text-xl"
                                    title="Edit"
                                  ></i>
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteClick(siswa.id_siswa)}
                                >
                                  <i
                                    className="bx bx-trash text-xl"
                                    title="Delete"
                                  ></i>
                                </button>
                                <button
                                  className="text-slate-500 hover:text-slate-700 ml-1"
                                  onClick={() => handleHistoryClick(siswa)}
                                >
                                  <i className="bx bx-history text-xl"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {showAddForm && (
                <div className="container h-[45em] px-4 py-3">
                  <h1
                    className={`text-2xl font-bold p-2 ${NavOpen ? "" : "ml-12"
                      }`}
                  >
                    Tambah Siswa Baru
                  </h1>
                  <form
                    className="w-full h-full pt-2 pb-2 scroll rounded-md border-1 border-slate-200 shadow-md"
                    onSubmit={handleAddFormSubmit}
                  >
                    <div className="mb-2 px-4">
                      <label className="block text-sm font-medium mb-1">
                        Nama Siswa
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Masukkan nama siswa"
                        value={newSiswa.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-2 px-4">
                      <label className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Masukkan email"
                        value={newSiswa.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-2 px-4">
                      <label className="block text-sm fonttext-sm font-medium mb-1">
                        No. Telp
                      </label>
                      <input
                        type="text"
                        name="no_telepon"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Masukkan nomor telepon"
                        value={newSiswa.no_telepon}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-2 px-4">
                      <label className="block text-sm font-medium mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={newSiswa.status}
                        onChange={handleInputChange}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="mb-2 px-4">
                      <label className="block text-sm font-medium mb-1">
                        Foto Profil
                      </label>
                      <input
                        type="file"
                        name="foto_profil"
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-2 px-4">
                      <label className="block text-sm font-medium mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Masukkan password"
                        value={newSiswa.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-2 px-4">
                      <label className="block text-sm font-medium mb-1">
                        Konfirmasi Password
                      </label>
                      <input
                        type="password"
                        name="password_confirmation"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Konfirmasi password"
                        value={newSiswa.password_confirmation}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    {passwordMatchError && (
                      <p className="text-red-500 text-sm px-4">{passwordMatchError}</p>
                    )}
                    <div className="flex gap-2 px-4">
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-1 rounded"
                      >
                        Tambah
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="bg-gray-500 text-white px-4 py-1 rounded"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {showEditForm && selectedSiswa && (
                <div className="container h-[45em] px-4 py-3">
                  <h1
                    className={`text-2xl font-bold p-2 ${NavOpen ? "" : "ml-12"
                      }`}
                  >
                    Edit Siswa
                  </h1>
                  <form
                    className="w-full h-full pt-2 pb-2 scroll rounded-md border-1 border-slate-200 shadow-md"
                    onSubmit={handleEditFormSubmit}
                  >
                      <input
                        type="hidden"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={selectedSiswa.id_siswa || ""}
                        readOnly
                      />
                    <div className="mb-2 px-4">
                      <label className="block text-sm font-medium mb-1">
                        Nama Siswa
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={editSiswa.name || ""}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="mb-2 px-4">
                      <label className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={editSiswa.email || ""}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="mb-2 px-4">
                      <label className="block text-sm font-medium mb-1">
                        No. Telp
                      </label>
                      <input
                        type="text"
                        name="no_telepon"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={editSiswa.no_telepon || ""}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="mb-2 px-4">
                      <label className="block text-sm font-medium mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={editSiswa.status || ""}
                        onChange={handleEditInputChange}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="mb-2 px-4">
                      <label className="block text-sm font-medium mb-1">
                        Foto Profil
                      </label>
                      <input
                        type="file"
                        name="foto_profil"
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={handleEditInputChange}
                      />
                      {selectedSiswa.foto_profil && typeof selectedSiswa.foto_profil === 'string' && (
                        <img
                          src={`${API_URL}/storage/${selectedSiswa.foto_profil}`}
                          alt="Current Profile"
                          className="mt-2 h-20 w-20 object-cover rounded-full"
                        />
                      )}
                    </div>
                    <div className="mb-2 px-4">
                      <label className="block text-sm font-medium mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Masukkan password baru (kosongkan jika tidak ingin diubah)"
                        value={editSiswa.password}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="mb-2 px-4">
                      <label className="block text-sm font-medium mb-1">
                        Konfirmasi Password
                      </label>
                      <input
                        type="password"
                        name="password_confirmation"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Konfirmasi password baru (kosongkan jika tidak ingin diubah)"
                        value={editSiswa.password_confirmation}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    {passwordMatchError && (
                      <p className="text-red-500 text-sm px-4">{passwordMatchError}</p>
                    )}
                    <div className="flex gap-2 px-4">
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-1 rounded"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEditForm(false)}
                        className="bg-gray-500 text-white px-4 py-1 rounded"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {showActivity && selectedSiswa && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-lg w-1/2">
                    <h2 className="text-xl font-bold mb-4">
                      Record Activity Siswa: {selectedSiswa.name}
                    </h2>
                    <div className="overflow-y-auto max-h-64">
                      <div className="mb-4">
                        <h3 className="font-semibold">Date</h3>
                        <input type="date" className="border-2 p-3 rounded-sm" />
                      </div>

                      <div className="mb-4">
                        <h3 className="font-semibold">Today</h3>
                        <p>Approve the borrowing of books - 09.47</p>
                        <p>Edit book Theory Relativity - 08.50</p>
                        <p>Add book Theory Relativity - 07.37</p>
                      </div>

                      <div className="mb-4">
                        <h3 className="font-semibold">Yesterday</h3>
                        <p>Approve the borrowing of books - 09.47</p>
                        <p>Edit book Theory Relativity - 08.50</p>
                        <p>Add book Theory Relativity - 07.37</p>
                      </div>

                      <div className="mb-4">
                        <h3 className="font-semibold">November 17, 2024</h3>
                        <p>Approve the borrowing of books - 09.47</p>
                        <p>Edit book Theory Relativity - 08.50</p>
                        <p>Add book Theory Relativity - 07.37</p>
                      </div>
                    </div>
                    <button
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={closeActivity}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </section>
          </main>
        </div>
      </section>
    </>
  );
}

export default Data_Siswa;