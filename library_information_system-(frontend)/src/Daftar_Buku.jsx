import { Link } from "react-router-dom";
import "./App.css";
import "./index.css";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

function Daftarbuku() {
  const [buku, setBuku] = useState([]);
  const [tampilkanBuku, setTampilan] = useState(false);
  const [selectedBuku, setSelectedBuku] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/books/") // Sesuaikan dengan endpoint API Laravel
      .then(response => {
        setBuku(response.data);
      })
      .catch(error => {
        console.error("Error fetching books:", error);
      });
  }, []);

  const handleShow = (buku) => {
    setSelectedBuku(buku);
    setTampilan(true);
  };

  const handleClose = () => {
    setTampilan(false);
  };

  return (
    <>
      <section className="bg-slate-100">
        <header className="bg-white text-black flex justify-between items-center h-15">
          <h1 className="text-3xl font-bold tracking-wide pl-14">Perpustakaan</h1>
        </header>
        <div className="pl-14 pt-5 flex gap-x-6">
          <h2 className="text-black font-semibold text-2xl tracking-wide">Daftar Buku</h2>
        </div>
        <main className="container h-[430px] mt-2">
          <div className="max-w-full h-full w-[91%] my-0 mx-auto overflow-auto flex gap-x-4 flex-wrap">
            {buku.map((item) => (
              <div key={item.id} className="w-36 h-52 p-1 relative flex flex-col">
                <div className="w-30 h-[80%] border-3 border-rose-400 rounded-l-[25px] overflow-hidden relative">
                  <img src={item.image_url} alt={item.judul} className="w-full h-full rounded-l-[20px]" />
                  <div className="w-full py-1 border-0 absolute bottom-[0] rounded-l-3xl text-center bg-rose-400">
                    <button className="text-black font-semibold bg-white px-6 rounded-md hover:bg-slate-700 hover:text-white" onClick={() => handleShow(item)}>
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
        {tampilkanBuku && selectedBuku && (
          <motion.div className="w-full h-[492px] bg-black absolute top-[10.8%] pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="pl-14 pt-5 flex gap-x-6">
              <h2 className="text-white font-semibold text-2xl tracking-wide">Detail Buku</h2>
            </div>
            <main className="container h-[440px]">
              <motion.div className="max-w-[450px] h-[95%] rounded-xl bg-white shadow-md my-0 mx-auto relative" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.7 }}>
                <span className="text-xl font-bold absolute right-3 py-1 cursor-pointer" onClick={handleClose}>X</span>
                <div className="w-full h-42 flex justify-center items-center">
                  <div className="w-30 h-34 border-3 rounded-l-[25px] overflow-hidden border-rose-400">
                    <img src={selectedBuku.image_url} alt={selectedBuku.judul} className="w-full h-full rounded-l-[22px]" />
                  </div>
                </div>
                <div className="w-full h-61">
                  <table className="text-black text-center flex flex-col justify-center items-center">
                    <tbody>
                      <tr><th>Judul Buku</th><td>:</td><td>{selectedBuku.judul}</td></tr>
                      <tr><th>Penulis</th><td>:</td><td>{selectedBuku.pengarang}</td></tr>
                      <tr><th>Penerbit</th><td>:</td><td>{selectedBuku.penerbit}</td></tr>
                      <tr><th>Tahun Terbit</th><td>:</td><td>{selectedBuku.tahun_terbit}</td></tr>
                      <tr><th>Deskripsi</th><td>:</td><td>{selectedBuku.deskripsi}</td></tr>
                      <tr><th>Genre</th><td>:</td><td>{selectedBuku.kategori}</td></tr>
                      <tr><th>Lantai</th><td>:</td><td>{selectedBuku.lantai}</td></tr>
                      <tr><th>rak Buku</th><td>:</td><td>{selectedBuku.lantai}</td></tr>

                    </tbody>
                  </table>
                </div>
              </motion.div>
            </main>
          </motion.div>
        )}
      </section>
    </>
  );
}

export default Daftarbuku;