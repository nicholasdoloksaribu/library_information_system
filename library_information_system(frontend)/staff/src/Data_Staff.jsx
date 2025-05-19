import "./App.css";
import { useState, useEffect, useCallback } from "react";
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

function Data_Staff() {
  const [NavOpen, setIsNavOpen] = useState(true);
  const [showPengelolaanDropdown, setShowPengelolaanDropdown] = useState(false);
  const [showAnggotaDropdown, setShowAnggotaDropdown] = useState(false);
  const [showPengelolaanStaff, setStaff] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffData, setStaffData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [editData, setEditData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [staffActivities, setStaffActivities] = useState([]);

  const fetchStaffActivities = async (staffId) => {
    try {
      const response = await api.get(`/headperpustakaan/activity_staffs`);
      // console.log("Respons dari API Aktivitas:", response.data);
      setStaffActivities(response.data.data); // Ambil data dari response.data.data
    } catch (error) {
      console.error("Gagal mengambil aktivitas staff:", error);
      alert("Gagal mengambil aktivitas staff.");
      setStaffActivities([]);
    }
  };

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

  const handleEditClick = (staff) => {
    setEditingStaff(staff);
    setEditData({ ...staff });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingStaff(null);
    setEditData(null);
    setProfilePicture(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEditData(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    if (!editingStaff) return; // Pastikan ada staff yang sedang diedit

    try {
      const formData = new FormData();
      formData.append('id_staff', editingStaff.id_staff);
      formData.append('name', editData.name);
      formData.append('email', editData.email);
      formData.append('no_telepon', editData.no_telepon);
      formData.append('tanggal_daftar', editData.tanggal_daftar);
      formData.append('hak_akses_CRUD', editData.hak_akses_CRUD);
      formData.append('hak_akses_approve', editData.hak_akses_approve);
      formData.append('status', editData.status);
      console.log("Nilai status yang dikirim:", editData.status);
      if (profilePicture) {
        formData.append('foto_profil', profilePicture);
      }
      if (editData.password) {
        formData.append('password', editData.password);
      }

      await api.post(`/headperpustakaan/staffs/${editingStaff.id_staff}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const response = await api.get(`/headperpustakaan/staffs`);
      setStaffData(response.data);
      setIsEditing(false);
      setEditingStaff(null);
      setEditData(null);
      setProfilePicture(null);
      alert("Data staff berhasil diperbarui.");
    } catch (error) {
      console.error("Gagal mengupdate staff:", error);
      alert("Gagal mengupdate staff.");
    }
  };

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await api.get(`/headperpustakaan/staffs`);
        setStaffData(response.data);
        console.log("Data staff berhasil diambil:", response.data);
      } catch (error) {
        console.error("Gagal mengambil data staff:", error);
      }
    };

    fetchStaffData();
  }, []);

  const handleWriteCheckboxChange = async (id_staff, currentWriteAccess) => {
    try {
      await api.put(`/headperpustakaan/staffs/${id_staff}`, {
        hak_akses_CRUD: !currentWriteAccess,
      });
      // Refresh data setelah update
      const response = await api.get(`/headperpustakaan/staffs`);
      setStaffData(response.data);
      alert('Approve access updated')
    } catch (error) {
      console.error("Gagal memperbarui hak akses write:", error);
      alert("Gagal memperbarui hak akses write.");
    }
  };

  const handleApproveCheckboxChange = async (id_staff, currentApproveAccess) => {
    try {
      await api.put(`/headperpustakaan/staffs/${id_staff}`, {
        hak_akses_approve: !currentApproveAccess,
      });
      // Refresh data setelah update
      const response = await api.get(`/headperpustakaan/staffs`);
      setStaffData(response.data);
      alert('Approve access updated')
    } catch (error) {
      console.error("Gagal memperbarui hak akses approve:", error);
      alert("Gagal memperbarui hak akses approve.");
    }
  };

  const handleHistoryClick = (staff) => {
    setSelectedStaff(staff);
    setShowActivity(true);
    fetchStaffActivities();
  };

  const closeActivity = () => {
    setShowActivity(false);
    setSelectedStaff(null);
  };

  const handleDeleteClick = async (id_staff) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus staff dengan ID: ${id_staff}?`)) {
      try {
        await api.delete(`/headperpustakaan/staffs/${id_staff}`);
        // Setelah berhasil menghapus, refresh data staff
        const response = await api.get(`/headperpustakaan/staffs`);
        setStaffData(response.data);
        alert("Staff berhasil dihapus.");
      } catch (error) {
        console.error("Gagal menghapus staff:", error);
        alert("Gagal menghapus staff.");
      }
    }
  };

  const filteredStaffData = staffData.filter((staff) => {
    const searchLower = searchTerm.toLowerCase();
    const isNotPending = staff.status?.toLowerCase() !== 'pending';
    return isNotPending && (
      staff.name?.toLowerCase().includes(searchLower) ||
      staff.username?.toLowerCase().includes(searchLower) ||
      staff.no_telepon?.toLowerCase().includes(searchLower) ||
      staff.status?.toLowerCase().includes(searchLower) ||
      staff.kode_staff?.toLowerCase().includes(searchLower)
);

  });

  const generatePDF = useCallback((data) => {
    const doc = new jsPDF();
    doc.text("Data Staff", 10, 10);

    const head = [['No', 'Nama Staff', 'Email', 'No. Telp', 'Tanggal Daftar', 'Status', 'Write', 'Approve']];
    const body = data.map((staff, index) => [
      index + 1,
      staff.name,
      staff.email,
      staff.no_telepon,
      formatDate(staff.tanggal_daftar),
      staff.status,
      staff.hak_akses_CRUD ? 'Ya' : 'Tidak',
      staff.hak_akses_approve ? 'Ya' : 'Tidak',
    ]);

    autoTable(doc, {
      head: head,
      body: body,
      startY: 20,
    });

    doc.save(`data_staff_${new Date().toLocaleDateString()}.pdf`);
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
            <section className="container h-full flex flex-col">
              <div className="max-w-full w-4xl my-0 mx-auto bg-white h-full py-2 flex flex-col">
                <div className="w-full h-20 rounded-md flex items-center justify-between mb-1">
                  <h1 className="font-semibold text-2xl">Data Staff</h1>
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
                      onClick={() => generatePDF(filteredStaffData)}
                    >
                      Export to PDF
                    </button>
                  </div>
                </div>

                <div className="flex-grow w-full rounded-xl">
                <div className="min-w-full">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr className="bg-gray-600 text-white">
                        <th className="py-2 px-4 border-b">No</th>
                        <th className="py-2 px-4 border-b">Nama Staff</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">No. Telp</th>
                        <th className="py-2 px-4 border-b">Tanggal Daftar</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Hak Akses</th>
                        <th className="py-2 px-4 border-b">Ket</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaffData.map((staff, index) => (
                        <tr key={staff.id_staff} className="hover:bg-gray-100">
                          <td className="py-2 px-4 border-b text-center">
                            {index + 1}
                          </td>
                          <td className="py-2 px-4 border-b">{staff.name}</td>
                          <td className="py-2 px-4 border-b">{staff.email}</td>
                          <td className="py-2 px-4 border-b">{staff.no_telepon}</td>
                          <td className="py-2 px-4 border-b">{formatDate(staff.tanggal_daftar)}</td>
                          <td className="py-2 px-4 border-b">{staff.status}</td>
                          <td className="py-4 border-b">
                            <div>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={staff.hak_akses_CRUD}
                                  onChange={(e) => handleWriteCheckboxChange(staff.id_staff, staff.hak_akses_CRUD)}
                                />{" "}
                                Write
                              </label>
                              <label className="block">
                                <input
                                  type="checkbox"
                                  checked={staff.hak_akses_approve}
                                  onChange={(e) => handleApproveCheckboxChange(staff.id_staff, staff.hak_akses_approve)}
                                />{" "}
                                Approve
                              </label>
                            </div>
                          </td>
                          <td className="py-2 px-4 border-b">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditClick(staff)}
                                className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-2 rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(staff.id_staff)}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                              >
                                Hapus
                              </button>
                              <button
                                className="text-slate-500 hover:text-slate-700 ml-1"
                                onClick={() => handleHistoryClick(staff)}
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
              </div>
            </section>
          </main>
        </div>

        {isEditing && editingStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Data Staff</h2>
              <form onSubmit={handleUpdateStaff}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nama Staff:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editData?.name || ''}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editData?.email || ''}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="no_telepon" className="block text-gray-700 text-sm font-bold mb-2">No. Telepon:</label>
                  <input
                    type="text"
                    id="no_telepon"
                    name="no_telepon"
                    value={editData?.no_telepon || ''}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="tanggal_daftar" className="block text-gray-700 text-sm font-bold mb-2">Tanggal Daftar:</label>
                  <input
                    type="date"
                    id="tanggal_daftar"
                    name="tanggal_daftar"
                    value={editData?.tanggal_daftar ? editData.tanggal_daftar.substring(0, 10) : ''}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
                  <select
                    id="status"
                    name="status"
                    value={editData?.status || ''}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Pilih Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Hak Akses:</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hak_akses_CRUD"
                      name="hak_akses_CRUD"
                      checked={editData?.hak_akses_CRUD || false}
                      onChange={handleCheckboxChange}
                      className="mr-2 leading-tight"
                    />
                    <label htmlFor="hak_akses_CRUD" className="text-sm">Write</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hak_akses_approve"
                      name="hak_akses_approve"
                      checked={editData?.hak_akses_approve || false}
                      onChange={handleCheckboxChange}
                      className="mr-2 leading-tight"
                    />
                    <label htmlFor="hak_akses_approve" className="text-sm">Approve</label>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="foto_profil" className="block text-gray-700 text-sm font-bold mb-2">Foto Profil (opsional):</label>
                  {editingStaff?.foto_profil && (
                    <div className="mb-2">
                      <label className="block text-gray-700 text-xs italic mb-1">Foto Profil Saat Ini:</label>
                      <img
                        src={`${API_URL}/storage/${editingStaff.foto_profil}`}
                        alt={`Foto Profil ${editingStaff.name}`}
                        className="w-24 h-24 rounded-full object-cover shadow-md"
                      />
                    </div>
                  )}
                  <label htmlFor="foto_profil" className="block text-gray-700 text-sm font-bold mb-2">Foto Profil (opsional):</label>
                  <input
                    type="file"
                    id="foto_profil"
                    name="foto_profil"
                    onChange={handleFileChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {editingStaff?.foto_profil && (
                    <p className="text-gray-500 text-xs italic">File saat ini: {editingStaff.foto_profil}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password Baru (opsional):</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <p className="text-gray-500 text-xs italic">Kosongkan jika tidak ingin mengubah password.</p>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                    onClick={handleCancelEdit}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showActivity && selectedStaff && Array.isArray(staffActivities) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-1/2">
              <h2 className="text-xl font-bold mb-4">
                Record Activity Staff: {selectedStaff.name}
              </h2>
              <div className="overflow-y-auto max-h-64">
                {/* Kelompokkan semua aktivitas berdasarkan id_staff */}
                {Object.entries(staffActivities.reduce((grouped, activity) => {
                  if (!grouped[activity.id_staff]) {
                    grouped[activity.id_staff] = [];
                  }
                  grouped[activity.id_staff].push(activity);
                  return grouped;
                }, {})).map(([staffId, activities]) => {
                  // Hanya tampilkan aktivitas untuk staff yang sedang dipilih
                  if (parseInt(staffId) === selectedStaff.id_staff) {
                    return Object.entries(activities.reduce((groupedByDate, activity) => {
                      const date = formatDate(activity.created_at)?.split(' ')[0];
                      if (date && !groupedByDate[date]) {
                        groupedByDate[date] = [];
                      }
                      date && groupedByDate[date]?.push(activity);
                      return groupedByDate;
                    }, {})).map(([date, activitiesByDate]) => (
                      <div key={`<span class="math-inline">\{staffId\}\-</span>{date}`} className="mb-4">
                        <h3 className="font-semibold">{date}</h3>
                        {Array.isArray(activitiesByDate) && activitiesByDate.map((activity, index) => (
                          <p key={activity.id_activity} className="text-sm">
                            {activity.aktivitas} - {new Date(activity.created_at).toLocaleTimeString()}
                          </p>
                        ))}
                      </div>
                    ));
                  }
                  return null;
                })}
                {!staffActivities.some(activity => activity.id_staff === selectedStaff.id_staff) && (
                  <p className="text-gray-500 italic">Tidak ada aktivitas untuk staff ini.</p>
                )}
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
    </>
  );
}

export default Data_Staff;