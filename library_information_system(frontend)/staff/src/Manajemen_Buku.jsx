import "./App.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBarComponent from "./components/NavBarComponent";
import UserNav from "./components/UserNav";
import Cookies from 'js-cookie';
import { fetchData } from "./utils/api";
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from "jspdf-autotable";

function Manajemen_Buku() {
  const [NavOpen, setIsNavOpen] = useState(true);
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [showPengelolaanDropdown, setShowPengelolaanDropdown] = useState(false);
  const [showAnggotaDropdown, setShowAnggotaDropdown] = useState(false);
  const [showEditBook, setShowEditBook] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetailBook, setDetailBook] = useState(false);
  const [detailBookData, setDetailBookData] = useState(null);
  const [dataBuku, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const closeAddBookForm = () => {
    setShowAddBookForm(false)
  }

  const toggleEditBook = (buku) => {
    setSelectedBook(buku);
    setShowEditBook(!showEditBook);
  };

  const toggleAnggotaDropdown = () => {
    setShowAnggotaDropdown(!showAnggotaDropdown);
  };

  const togglePengelolaanDropdown = () => {
    setShowPengelolaanDropdown(!showPengelolaanDropdown);
  };

  const toggleAddBookForm = () => {
    setShowAddBookForm(true);
  };

  const toggleDetailBook = (buku) => {
    setDetailBookData(buku);
    setDetailBook(!showDetailBook);
  };

  const handleDelete = async (kode_buku) => {
    const token = Cookies.get('access_token');

    try {
      const response = await axios.delete(`${API_URL}/api/staff/books/${kode_buku}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Buku berhasil dihapus:', response.data.message || 'Success');

    } catch (error) {
      console.error('Gagal menghapus buku:', error.response ? error.response.data : error.message);
    }
  };

  const filteredDataBuku = dataBuku.filter((buku) =>
    buku.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buku.pengarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buku.penerbit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buku.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDFBuku = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['No', 'Judul', 'Pengarang', 'Penerbit', 'Kategori', 'Stok']],
      body: filteredDataBuku.map((buku, index) => [
        index + 1,
        buku.judul,
        buku.pengarang,
        buku.penerbit,
        buku.kategori,
        buku.stok,
      ]),
      startY: 20,
    });
    doc.save(`data_buku_${new Date().toLocaleDateString()}.pdf`);
  };

  const fetchBooks = async () => {
    try {
      const token = Cookies.get('access_token');
      const response = await fetch(`${API_URL}/api/${Cookies.get('access')}/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [API_URL]);

  const navigate = useNavigate();

  // TAMBAH
  const [formData, setFormData] = useState({
    kode_buku: '',
    judul: '',
    pengarang: '',
    penerbit: '',
    tahun_terbit: '',
    call_number: '',
    deskripsi: '',
    isbn: '',
    stok: '',
    rak: ''
  });

  const [fotoBuku, setFotoBuku] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFotoBuku(e.target.files[0]);
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    const token = Cookies.get('access_token');

    const form = new FormData();
    
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    if (fotoBuku) {
      form.append('foto_buku', fotoBuku);
    }
    try {
      const response = await fetch(`${API_URL}/api/${Cookies.get('access')}/books/str`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form
      });
      
      const result = await response.json();
      console.log(response)

      if (response.ok) {
        alert('Buku berhasil ditambahkan!');
        setShowAddBookForm(false);
        fetchBooks();

      } else {
        alert(result.message || 'Terjadi kesalahan saat menambahkan buku.');
      }
    } catch (error) {
      console.error('Gagal menambahkan buku:', error);
      alert('Gagal menambahkan buku.', error);
    }
  };

  const handleUpdateBook = async (kode_buku, e) => {
      e.preventDefault();
      console.log(selectedBook)

      const token = Cookies.get('access_token');
      const form = new FormData();
      
      // Menambahkan data ke FormData
      for (const key in selectedBook) {
        if (key !== 'kode_buku') {
          form.append(key, selectedBook[key]);
        }
      }

      if (fotoBuku) {
        form.append('foto_buku', fotoBuku);
      }

      for (const pair of form.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

      try {
        const response = await axios.post(`${API_URL}/api/${Cookies.get('access')}/books/${selectedBook.id}/edit`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });

        console.log('Data berhasil diperbarui:', response.data);
        setShowEditBook(false)
        // TAMBAH DISINI LOAD DATANYA
        fetchBooks()
      } catch (error) {
        console.error('Error saat update:', error);
      }
  };

  return (
    <>
      <section className="h-screen overflow-hidden">
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        ></link>

        <div className="w-full h-full flex relative">
          <NavBarComponent></NavBarComponent>

          <main className="h-full overflow-auto flex-3">
            {!showAddBookForm && !showEditBook && !showDetailBook && (
              <UserNav></UserNav>
            )}
            
            <section className="container h-full flex flex-col" >
            <div className="max-w-full w-4xl my-0 mx-auto h-full py-2 flex flex-col">
              {!showAddBookForm && !showEditBook && !showDetailBook && (
                <div className="flex mb-3 h-8 justify-end mr-5 gap-x-6 items-center">
                  <div className="w-50 flex relative">
                    <input
                    type="text"
                    placeholder="Search"
                    className="w-[90%] border-1 border-slate-300 rounded-2xl pl-2 pr-8 outline-1 outline-gray-300"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    />
                    <i className="bx bx-x absolute right-11 top-2 text-xl"></i>
                    <button className="ml-1 px-1 py-1 mt-[1px] text-xl rounded-2xl cursor-pointer">
                      <i className="bx bx-search leading-2"></i>
                    </button>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                      onClick={generatePDFBuku}
                    >
                      Print PDF
                    </button>
                    <button
                      className="bg-slate-500 text-white px-2 py-1 rounded-sm cursor-pointer"
                      onClick={toggleAddBookForm}
                    >
                      Add Book
                    </button>
                  </div>
                </div>
              )}
              {showAddBookForm && (
                <div className="w-full p-4 bg-white rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Tambah Buku</h2>
                  <form onSubmit={handleAddBook}>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Kode Buku" name="kode_buku" value={formData.kode_buku} onChange={handleChange} required className="border p-2 rounded" />
                      <input type="text" placeholder="Judul" name="judul" value={formData.judul} onChange={handleChange} required className="border p-2 rounded" />
                      <input type="text" placeholder="Pengarang" name="pengarang" value={formData.pengarang} onChange={handleChange} required className="border p-2 rounded" />
                      <input type="text" placeholder="Penerbit" name="penerbit" value={formData.penerbit} onChange={handleChange} required className="border p-2 rounded" />
                      <input type="number" placeholder="Tahun Terbit" name="tahun_terbit" value={formData.tahun_terbit} onChange={handleChange} required className="border p-2 rounded" />
                      <input type="text" placeholder="Call Number" name="call_number" value={formData.call_number} onChange={handleChange} required className="border p-2 rounded" />
                      <input type="text" placeholder="Deskripsi" name="deskripsi" value={formData.deskripsi} onChange={handleChange} className="border p-2 rounded" />
                      <input type="text" placeholder="ISBN" name="isbn" value={formData.isbn} onChange={handleChange} className="border p-2 rounded" />
                      <input type="number" placeholder="Stok" name="stok" value={formData.stok} onChange={handleChange} required className="border p-2 rounded" />
                      <input type="text" placeholder="Rak" name="rak" value={formData.rak} onChange={handleChange} required className="border p-2 rounded" />
                      <input type="file" name="foto_buku" onChange={handleFileChange} className="border p-2 rounded" />
                    </div>
                    <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Simpan Buku
                    </button>
                    <button type="button" className="mt-4 ml-5 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700" onClick={closeAddBookForm}>
                      Tutup
                    </button>
                  </form>
                </div>
              )}
              {!showAddBookForm && !showEditBook && !showDetailBook && (
                <div className="flex-grow w-full overflow-auto rounded-xl">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead className="sticky top-0">
                      <tr className="bg-gray-600 text-white">
                        <th className="py-2 px-4 border-b">NO</th>
                        <th className="py-2 px-4 border-b">Judul</th>
                        <th className="py-2 px-4 border-b">Pengarang</th>
                        <th className="py-2 px-4 border-b">Penerbit</th>
                        <th className="py-2 px-4 border-b">Kategori</th>
                        <th className="py-2 px-4 border-b">Stok</th>
                        <th className="py-2 px-4 border-b">Ket</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataBuku
                        .filter((buku) =>
                          buku.judul.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((buku, index) => (
                        <tr key={buku.id} className="hover:bg-gray-100">
                          <td className="py-2 px-4 border-b text-center">
                            {index + 1}
                          </td>
                          <td className="py-2 px-4 border-b">{buku.judul}</td>
                          <td className="py-2 px-4 border-b">{buku.pengarang}</td>
                          <td className="py-2 px-4 border-b">
                            {buku.penerbit}
                          </td>
                          <td className="py-2 px-4 border-b">{buku.kategori}</td>
                          <td className="py-2 px-4 border-b text-center">
                            {buku.stok}
                          </td>
                          <td className="py-2 px-4 border-b">
                            <button
                              className="text-blue-500 hover:text-blue-700 mr-2"
                              onClick={() => toggleEditBook(buku)}
                            >
                              <i
                                className="bx bxs-edit text-xl"
                                title="Edit"
                              ></i>
                            </button>
                            <button
                              className="text-gray-500 hover:text-gray-700 mr-2"
                              onClick={() => toggleDetailBook(buku)}
                            >
                              <i
                                className="bx bxs-detail text-xl"
                                title="Detail"
                              ></i>
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700 block"
                              onClick={() => handleDelete(buku.kode_buku)}
                            >
                              <i
                                className="bx bx-block text-xl"
                                title="Delete"
                              ></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {showEditBook && (
                <div className="w-full p-4 bg-white rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Edit Buku</h2>
                  <form onSubmit={(e) => handleUpdateBook(selectedBook?.kode_buku || "", e)} encType="multipart/form-data">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="hidden"
                        placeholder="Kode Buku"
                        name="kode_buku"
                        value={selectedBook?.kode_buku || ""}
                        onChange={(e) =>
                          setSelectedBook({ ...selectedBook, kode_buku: e.target.value })
                        }
                        required
                        className="border p-2 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Judul"
                        name="judul"
                        value={selectedBook?.judul || ""}
                        onChange={(e) =>
                          setSelectedBook({ ...selectedBook, judul: e.target.value })
                        }
                        required
                        className="border p-2 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Pengarang"
                        name="pengarang"
                        value={selectedBook?.pengarang || ""}
                        onChange={(e) =>
                          setSelectedBook({ ...selectedBook, pengarang: e.target.value })
                        }
                        required
                        className="border p-2 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Penerbit"
                        name="penerbit"
                        value={selectedBook?.penerbit || ""}
                        onChange={(e) =>
                          setSelectedBook({ ...selectedBook, penerbit: e.target.value })
                        }
                        required
                        className="border p-2 rounded"
                      />
                      <input
                        type="number"
                        placeholder="Tahun Terbit"
                        name="tahun_terbit"
                        value={selectedBook?.tahun_terbit || ""}
                        onChange={(e) =>
                          setSelectedBook({ ...selectedBook, tahun_terbit: e.target.value })
                        }
                        required
                        className="border p-2 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Call Number"
                        name="call_number"
                        value={selectedBook?.call_number || ""}
                        onChange={(e) =>
                          setSelectedBook({ ...selectedBook, call_number: e.target.value })
                        }
                        required
                        className="border p-2 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Deskripsi"
                        name="deskripsi"
                        value={selectedBook?.deskripsi || ""}
                        onChange={(e) =>
                          setSelectedBook({ ...selectedBook, deskripsi: e.target.value })
                        }
                        className="border p-2 rounded"
                      />
                      <input
                        type="text"
                        placeholder="ISBN"
                        name="isbn"
                        value={selectedBook?.isbn || ""}
                        onChange={(e) =>
                          setSelectedBook({ ...selectedBook, isbn: e.target.value })
                        }
                        className="border p-2 rounded"
                      />
                      <input
                        type="number"
                        placeholder="Stok"
                        name="stok"
                        value={selectedBook?.stok || ""}
                        onChange={(e) =>
                          setSelectedBook({ ...selectedBook, stok: e.target.value })
                        }
                        required
                        className="border p-2 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Rak"
                        name="rak"
                        value={selectedBook?.rak || ""}
                        onChange={(e) =>
                          setSelectedBook({ ...selectedBook, rak: e.target.value })
                        }
                        required
                        className="border p-2 rounded"
                      />
                      <input type="text" placeholder="Kategori" name="kategori" value={selectedBook?.kategori || ""} onChange={(e) => setSelectedBook({ ...selectedBook, kategori: e.target.value })} required className="border p-2 rounded" />
                      <input
                        type="file"
                        name="foto_buku"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="border p-2 rounded text-gray-500"
                      />
                      {selectedBook.foto_buku && typeof selectedBook.foto_buku === 'string' && (
                        <img
                          src={`${API_URL}/storage/${selectedBook.foto_buku}`}
                          alt="Current Profile"
                          className="mt-2 h-20 w-20 object-cover rounded-full"
                        />
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Simpan Perubahan
                      </button>
                      <button
                        type="button"
                        onClick={toggleEditBook}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Batal
                      </button>
                    </div>
                  </form>

                </div>
              )}

              {showDetailBook && (
                <div className="container h-[33em] rounded-xl overflow-hidden">
                  <main className="w-full h-full">
                    <h1
                      className={`text-2xl pl-2 py-1 ${NavOpen ? "" : "ml-10"}`}
                    >
                      Detail Book
                    </h1>
                    <div className="w-full h-full bg-white flex justify-center items-center py-3">
                      <div className="w-2/4 h-full shadow-md bg-slate-500 rounded-2xl text-white">
                        <div className="w-full h-42">
                          <div className="w-30 h-34 border-3 rounded-l-[25px] overflow-hidden border-white relative text-center mx-auto mt-7 mb-5">
                            <img
                              src={`${API_URL}/storage/buku/${detailBookData?.foto_buku}`}
                              alt={detailBookData?.judul}
                              className="w-full h-full rounded-l-[22px] object-cover"
                              onError={(e) => { e.target.onerror = null; e.target.src = API_URL+"/storage/"+detailBookData.foto_buku }}
                            />
                            <div className="w-full border-0 absolute bottom-[0] rounded-l-3xl text-center bg-white">
                              <button></button>
                            </div>
                          </div>
                          <div className="w-full h-32">
                            <table className="text-white text-center flex flex-col justify-center items-center">
                              <tbody>
                                <tr>
                                  <th className="w-28 p-2">Judul Buku</th>
                                  <td className="p-2">:</td>
                                  <td className="pl-1 p-2">
                                    {detailBookData?.judul}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="w-28 p-2">Penulis</th>
                                  <td className="p-2">:</td>
                                  <td className="pl-1 p-2">
                                    {detailBookData?.pengarang}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="w-28 p-2">Deskripsi</th>
                                  <td className="p-2">:</td>
                                  <td className="pl-1 p-2">
                                    {detailBookData?.deskripsi}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="w-28 p-2">Kategori</th>
                                  <td className="p-2">:</td>
                                  <td className="pl-1 p-2">
                                    {detailBookData?.kategori}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="w-28 p-2">Letak Buku</th>
                                  <td className="p-2">:</td>
                                  <td className="pl-1 p-2">
                                    Rak {detailBookData?.rak}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="w-28 p-2">Tahun Terbit</th>
                                  <td className="p-2">:</td>
                                  <td className="pl-1 p-2">
                                    {detailBookData?.tahun_terbit}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <footer className="w-full text-center">
                              <button
                                className="bg-gray-800 cursor-pointer px-5 py-1 rounded-md"
                                onClick={toggleDetailBook}
                              >
                                Close
                              </button>
                            </footer>
                          </div>
                        </div>
                      </div>
                    </div>
                  </main>
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

export default Manajemen_Buku;