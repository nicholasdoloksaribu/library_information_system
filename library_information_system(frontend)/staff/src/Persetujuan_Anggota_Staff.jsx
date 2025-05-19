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

function Persetujuan_Anggota_Staff() {
  const [NavOpen, setIsNavOpen] = useState(true);
  const [showPengelolaanDropdown, setShowPengelolaanDropdown] = useState(false);
  const [showAnggotaDropdown, setShowAnggotaDropdown] = useState(false);
  const [showPengelolaanStaff, setStaff] = useState(false);
  const [dataPersetujuanStaff, setDataPersetujuanStaff] = useState([]);
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

  const navigate = useNavigate();

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchDataStaff = async () => {
      try {
        const response = await api.get(`/headperpustakaan/staffs`);
        const pendingStaff = response.data.filter(staff => staff.status?.toLowerCase() === 'pending');
        setDataPersetujuanStaff(pendingStaff);
        console.log("Data persetujuan staff (pending) berhasil diambil:", pendingStaff);
      } catch (error) {
        console.error("Gagal mengambil data persetujuan staff:", error);
      }
    };

    fetchDataStaff();
  }, []);

  const filteredDataStaff = dataPersetujuanStaff.filter((staff) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      staff.nama_staff?.toLowerCase().includes(searchLower) ||
      staff.username?.toLowerCase().includes(searchLower) ||
      staff.no_telepon?.toLowerCase().includes(searchLower) ||
      staff.tanggal_daftar?.toLowerCase().includes(searchLower)
    );
  });

  const handleHakAksesChange = (id_staff, akses, checked) => {
    setDataPersetujuanStaff(prevData =>
      prevData.map(staff =>
        staff.id_staff === id_staff
          ? { ...staff, [akses]: checked }
          : staff
      )
    );
  };

  const canApprove = (staff) => {
    return staff.hak_akses_CRUD || staff.hak_akses_approve;
  };

  const handleUpdatePersetujuan = async (id_staff, status, hak_akses_CRUD, hak_akses_approve) => {
    try {
      const response = await api.put(`/headperpustakaan/staffs/${id_staff}`, {
        id_staff: id_staff,
        status: status,
        hak_akses_CRUD: hak_akses_CRUD,
        hak_akses_approve: hak_akses_approve,
      });
      console.log("Respons dari update persetujuan:", response.data);
      // Refresh data setelah update
      const updatedResponse = await api.get(`/headperpustakaan/staffs`);
      const pendingStaff = updatedResponse.data.filter(s => s.status?.toLowerCase() === 'pending');
      setDataPersetujuanStaff(pendingStaff);
      alert(`Persetujuan staff dengan ID ${id_staff} berhasil di${status}.`);
    } catch (error) {
      console.error("Gagal memperbarui persetujuan staff:", error);
      alert(`Gagal memperbarui persetujuan staff dengan ID ${id_staff}.`);
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
            <section className="container h-full flex flex-col">
              <div className="max-w-full w-6xl my-0 mx-auto bg-white h-full py-2 flex flex-col">
                <div className="w-full h-20 rounded-md flex items-center justify-between mb-1">
                  <h1 className="font-semibold text-2xl">
                    Persetujuan Staff Perpustakaan
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
                <div className="flex-grow w-full overflow-auto rounded-xl">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead className="sticky top-0">
                      <tr className="bg-gray-600 text-white">
                        <th className="py-2 px-4 border-b">No</th>
                        <th className="py-2 px-4 border-b">Nama Staff</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">No. Telp</th>
                        <th className="py-2 px-4 border-b">
                          Tanggal Pendaftaran
                        </th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Hak Akses</th>
                        <th className="py-2 px-4 border-b">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDataStaff.map((staff, index) => (
                        <tr key={staff.id_staff} className="hover:bg-gray-100">
                          <td className="py-2 px-4 border-b text-center">
                            {index + 1}
                          </td>
                          <td className="py-2 px-4 border-b">{staff.name}</td>
                          <td className="py-2 px-4 border-b">{staff.email}</td>
                          <td className="py-2 px-4 border-b">{staff.no_telepon}</td>
                          <td className="py-2 px-4 border-b">
                            {formatDate(staff.tanggal_daftar)}
                          </td>
                          <td className="py-2 px-4 border-b">{staff.status}</td>
                          <td className="py-4 border-b">
                            <div>
                              <label className="block">
                                <input
                                  type="checkbox"
                                  checked={staff.hak_akses_CRUD || false}
                                  onChange={(e) => handleHakAksesChange(staff.id_staff, 'hak_akses_CRUD', e.target.checked)}
                                />{" "}
                                Write
                              </label>
                              <label className="block">
                                <input
                                  type="checkbox"
                                  checked={staff.hak_akses_approve || false}
                                  onChange={(e) => handleHakAksesChange(staff.id_staff, 'hak_akses_approve', e.target.checked)}
                                />{" "}
                                Approve
                              </label>
                            </div>
                          </td>
                          <td className="py-2 px-4 border-b">
                            <div className="flex gap-2">
                              <button
                                className={`bg-green-500 text-white px-2 py-1 rounded-md ${canApprove(staff) ? '' : 'opacity-50 cursor-not-allowed'
                                  }`}
                                onClick={() =>
                                  canApprove(staff) && handleUpdatePersetujuan(
                                    staff.id_staff,
                                    'approved',
                                    staff.hak_akses_CRUD || false,
                                    staff.hak_akses_approve || false
                                  )
                                }
                                disabled={!canApprove(staff)}
                              >
                                Terima
                              </button>
                              <button
                                className="bg-red-500 text-white px-2 py-1 rounded-md"
                                onClick={() => handleUpdatePersetujuan(staff.id_staff, 'rejected', false, false)}
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

export default Persetujuan_Anggota_Staff;