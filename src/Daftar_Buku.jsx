import { Link } from "react-router-dom";
import "./App.css";
import "./index.css";
import React, { useState } from "react";
import { motion } from "framer-motion";

function Daftarbuku() {
  const [tampilkanBuku, setTampilan] = useState(false);
  const [tampilkanPinjam, setRating] = useState(false);
  const [tampilkanRating, setPeringkat] = useState(false);

  const showRating = () => {
    setPeringkat(true);
  };

  const closeRating = () => {
    setPeringkat(false);
  };

  const showPinjam = () => {
    setRating(true);
  };

  const closePinjam = () => {
    setRating(false);
  };

  const handleShow = () => {
    setTampilan(true);
  };

  const handleClose = () => {
    setTampilan(false);
  };

  return (
    <>
      <section className="bg-slate-100">
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        ></link>
        <header className="bg-white text-black flex justify-between items-center h-15">
          <h1 className="text-3xl font-bold tracking-wide pl-14">
            Perpustakaan
          </h1>
          <nav className="basis-2xl flex justify-around">
            <ul className="flex justify-between basis-full items-center relative">
              <li className="relative group">
                <Link to="/Daftar_Buku" className="relative block pb-1">
                  Beranda
                  <span className="absolute left-0 bottom-0 h-[2px] w-14 bg-black transition-all duration-300"></span>
                </Link>
              </li>
              <li className="relative group">
                <Link to="/Pinjaman_Buku" className="relative block pb-1">
                  Peminjaman Buku
                  <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-30.5"></span>
                </Link>
              </li>
              <li className="relative group">
                <Link to="/Riwayat_Buku" className="relative block pb-1">
                  Riwayat Buku
                  <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-22.5"></span>
                </Link>
              </li>
              <li className="relative group">
                <Link to="/Daftar_List" className="relative block pb-1">
                  Daftar List
                  <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-17"></span>
                </Link>
              </li>
            </ul>
            <ul className="basis-[50%] flex items-center justify-center gap-x-4">
              <li>
                <a href="#">
                  <i class="bx bx-search-alt-2 text-xl"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i class="bx bx-bell text-xl"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i class="bx bx-user-circle text-xl"></i>
                </a>
              </li>
            </ul>
          </nav>
        </header>
        <div className="pl-14 pt-5 flex gap-x-6">
          <h2 className="text-black font-semibold text-2xl tracking-wide">
            Daftar Buku
          </h2>
          <select
            id="Genre"
            className="text-black border-2 border-black rounded-md outline-1 outline-white pr-14"
          >
            <option value="Genre">Kategori</option>
          </select>
        </div>
        <main className="container h-[430px] mt-2">
          <div className="max-w-full h-full w-[91%] my-0 mx-auto overflow-auto flex gap-x-4 flex-wrap">
            <div className="w-36 h-52 p-1 relative flex flex-col">
              <div className="w-30 h-[80%] border-3 border-rose-400 rounded-l-[25px] overflow-hidden relative basis-full">
                <img
                  src="../public/study.jpg"
                  alt="Gambar"
                  className="w-full h-full rounded-l-[20px]"
                />
                <div className="w-full py-1 border-0 absolute bottom-[0] rounded-l-3xl text-center bg-rose-400">
                  <button
                    className="text-black font-semibold scale-80 cursor-pointer border-2 bg-white px-6 rounded-md hover:bg-slate-700 hover:text-white hover:border-2 hover:border-slate-700 transition-all duration-100"
                    onClick={handleShow}
                  >
                    Detail
                  </button>
                </div>
              </div>
              <div className="w-full mt-2">
                <ul className="flex justify-around">
                  <li className="scale-70">
                    <button className="text-black border-2 py-1 border-black px-3 rounded-md">
                      <i class="bx bx-plus font-semibold"></i>
                    </button>
                  </li>
                  <li className="scale-70">
                    <button
                      className="text-black border-2 py-1 border-black px-3 rounded-md"
                      onClick={showPinjam}
                    >
                      Pinjam
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
        {tampilkanBuku && (
          <motion.div
            className="w-full h-[492px] bg-black absolute top-[10.8%] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pl-14 pt-5 flex gap-x-6">
              <h2 className="text-white font-semibold text-2xl tracking-wide">
                Detail Buku
              </h2>
            </div>
            <main className="container h-[440px]">
              <motion.div
                className="max-w-[450px] h-[95%] rounded-xl bg-white shadow-md shadow-white my-0 mx-auto scroll pointer-events-auto relative"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <span
                  className="text-xl font-bold absolute right-3 py-1 cursor-pointer"
                  onClick={handleClose}
                >
                  X
                </span>
                <div className="w-full h-42 flex justify-center items-center">
                  <div className="w-30 h-34 border-3 rounded-l-[25px] overflow-hidden border-rose-400 relative">
                    <img
                      src="../public/study.jpg"
                      alt="Gambar"
                      className="w-full h-full rounded-l-[22px]"
                    />
                    <div className="w-full border-0 absolute bottom-[0] rounded-l-3xl text-center bg-rose-400">
                      <button></button>
                    </div>
                  </div>
                </div>
                <div className="w-full h-61">
                  <table className="text-black text-center flex flex-col justify-center items-center">
                    <tbody>
                      <tr>
                        <th className="w-28 p-2">Judul Buku</th>
                        <td className="p-2">:</td>
                        <td className="pl-1 p-2">
                          Relativity The Special & General Theory
                        </td>
                      </tr>
                      <tr>
                        <th className="w-28 p-2">Penulis</th>
                        <td className="p-2">:</td>
                        <td className="pl-1 p-2">Albert Einstein</td>
                      </tr>
                      <tr>
                        <th className="w-28 p-2">Penerbit</th>
                        <td className="p-2">:</td>
                        <td className="pl-1 p-2">MIT Press</td>
                      </tr>
                      <tr>
                        <th className="w-28 p-2">Deskripsi</th>
                        <td className="p-2">:</td>
                        <td className="pl-1 p-2">What is Relativity</td>
                      </tr>
                      <tr>
                        <th className="w-28 p-2">Genre</th>
                        <td className="p-2">:</td>
                        <td className="pl-1 p-2">Physics</td>
                      </tr>
                      <tr>
                        <th className="w-28 p-2">Letak Buku</th>
                        <td className="p-2">:</td>
                        <td className="pl-1 p-2">Lemari 1 Rak 3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <footer className="w-full h-12 flex justify-around items-center">
                  <button
                    className="font-semibold bg-green-500 text-white py-1 px-7 rounded-md cursor-pointer active:scale-90 transition-all duration-300"
                    onClick={showPinjam}
                  >
                    Pinjam
                  </button>
                  <button
                    className="font-semibold bg-green-500 text-white py-1 px-7 rounded-md cursor-pointer active:scale-90 transition-all duration-300"
                    onClick={showRating}
                  >
                    Rating
                  </button>
                </footer>
              </motion.div>
            </main>
          </motion.div>
        )}
        {tampilkanPinjam && (
          <div className="w-full h-[492px] bg-black absolute top-[10.8%] pointer-events-none">
            <div className="pl-14 pt-5 flex gap-x-6">
              <h2 className="text-white font-semibold text-2xl tracking-wide">
                Pinjam Buku
              </h2>
            </div>
            <main className="container h-[440px]">
              <motion.div
                className="max-w-[450px] h-[95%] rounded-xl bg-white shadow-md shadow-white my-0 mx-auto scroll pointer-events-auto"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
              >
                <div className="w-full h-42 flex justify-center items-center">
                  <div className="w-30 h-34 border-3 rounded-l-[25px] overflow-hidden border-rose-400 relative">
                    <img
                      src="../public/study.jpg"
                      alt="Gambar"
                      className="w-full h-full rounded-l-[22px]"
                    />
                    <div className="w-full border-0 absolute bottom-[0] rounded-l-3xl text-center bg-rose-400">
                      <button></button>
                    </div>
                  </div>
                </div>
                <div className="w-full h-32">
                  <table className="text-black text-center flex flex-col justify-center items-center">
                    <tbody>
                      <tr>
                        <th className="w-28 p-2">Judul Buku</th>
                        <td className="p-2">:</td>
                        <td className="pl-1 p-2">
                          Relativity The Special & General Theory
                        </td>
                      </tr>
                      <tr>
                        <th className="w-28 p-2">Penulis</th>
                        <td className="p-2">:</td>
                        <td className="pl-1 p-2">Albert Einstein</td>
                      </tr>
                      <tr>
                        <th className="w-28 p-2">Deskripsi</th>
                        <td className="p-2">:</td>
                        <td className="pl-1 p-2">What is Relativity</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <form action="#">
                  <div className="w-full h-36 flex flex-col px-10">
                    <div className="flex flex-col gap-y-1">
                      <label htmlFor="begin" className="font-semibold">
                        Tanggal Peminjaman
                      </label>
                      <input
                        type="date"
                        id="begin"
                        className="w-1/2 border-2 border-black py-1 pl-1 pr-2 rounded-sm font-semibold outline-0"
                      />
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <label htmlFor="end" className="font-semibold">
                        Tanggal Pengembalian
                      </label>
                      <input
                        type="date"
                        id="end"
                        className="w-1/2 border-2 border-black py-1 pl-1 pr-2 rounded-sm font-semibold outline-0"
                      />
                    </div>
                  </div>
                  <footer className="w-full h-12 flex justify-start pl-10 gap-x-4 items-center">
                    <button className="font-semibold bg-green-500 text-white py-1 px-7 rounded-md cursor-pointer active:scale-90 transition-all duration-300">
                      Pinjam
                    </button>
                    <button
                      className="font-semibold bg-green-500 text-white py-1 px-7 rounded-md cursor-pointer active:scale-90 transition-all duration-300"
                      onClick={closePinjam}
                    >
                      Batal
                    </button>
                  </footer>
                </form>
              </motion.div>
            </main>
          </div>
        )}
        {tampilkanRating && (
          <motion.div
            className="absolute w-full h-full bg-black top-0 left-0 pointer-events-none flex justify-center items-center flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-white bg-black text-center mb-4 text-3xl font-semibold">
              Rating Buku Ini
            </h1>
            <main className="w-1/3 rounded-xl h-4/5 bg-white scroll pointer-events-auto">
              <div className="w-full h-42 flex justify-center items-center">
                <div className="w-30 h-34 border-3 rounded-l-[25px] overflow-hidden border-rose-400 relative">
                  <img
                    src="../public/study.jpg"
                    alt="Gambar"
                    className="w-full h-full rounded-l-[22px]"
                  />
                  <div className="w-full border-0 absolute bottom-[0] rounded-l-3xl text-center bg-rose-400">
                    <button></button>
                  </div>
                </div>
              </div>
              <div className="w-full h-40 mb-3">
                <table className="text-black text-center flex flex-col justify-center items-center">
                  <tbody>
                    <tr>
                      <th className="w-28 p-2">Judul Buku</th>
                      <td className="p-2">:</td>
                      <td className="pl-1 p-2">
                        Relativity The Special & General Theory
                      </td>
                    </tr>
                    <tr>
                      <th className="w-28 p-2">Penulis</th>
                      <td className="p-2">:</td>
                      <td className="pl-1 p-2">Albert Einstein</td>
                    </tr>
                    <tr>
                      <th className="w-28 p-2">Deskripsi</th>
                      <td className="p-2">:</td>
                      <td className="pl-1 p-2">What is Relativity</td>
                    </tr>
                    <tr>
                      <th className="w-28 p-2">Genre</th>
                      <td className="p-2">:</td>
                      <td className="pl-1 p-2">Physics</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <form action="#">
                <div className="flex flex-col items-start gap-y-2 pl-8 pb-2">
                  <label htmlFor="ulasan" className="font-bold">
                    Ulasan
                  </label>
                  <textarea
                    name="ulasan"
                    id="ulasan"
                    className="text-black bg-slate-300 outline-0 pl-1 rounded-md w-[90%]"
                  ></textarea>
                </div>
                <div className="flex gap-x-3 pl-8 pb-3 pt-2">
                  <p className="font-semibold">Rating</p>
                  <div className="cursor-pointer">
                    <i class="bx bxs-star text-2xl text-yellow-300"></i>
                    <i class="bx bxs-star text-2xl text-yellow-300"></i>
                    <i class="bx bxs-star text-2xl text-yellow-300"></i>
                    <i class="bx bxs-star text-2xl text-yellow-300"></i>
                    <i class="bx bxs-star text-2xl"></i>
                  </div>
                </div>
                <footer className="w-full h-12 flex justify-center gap-x-4 items-center">
                  <button className="font-semibold bg-green-500 text-white py-1 px-7 rounded-md cursor-pointer active:scale-90 transition-all duration-300">
                    Kirim
                  </button>
                  <button
                    className="font-semibold bg-green-500 text-white py-1 px-7 rounded-md cursor-pointer active:scale-90 transition-all duration-300"
                    onClick={closeRating}
                  >
                    Batal
                  </button>
                </footer>
              </form>
            </main>
          </motion.div>
        )}
      </section>
    </>
  );
}

export default Daftarbuku;