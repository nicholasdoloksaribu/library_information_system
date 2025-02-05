import { Link } from "react-router-dom";
import "./App.css";
import "./index.css";

function Riwayat_Buku() {
  return (
    <>
      <section>
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
                  <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-14"></span>
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
                  <span className="absolute left-0 bottom-0 h-[2px] w-22.5 bg-black transition-all duration-300"></span>
                </Link>
              </li>
              <li className="relative group">
                <Link to="/Daftar_List" className="relative block pb-1">
                  Daftar_List
                  <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-18"></span>
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
        <div className="pl-14 pt-5 flex justify-between gap-x-6 pr-24">
          <h2 className="text-white font-semibold text-2xl tracking-wide">
            Riwayat Buku
          </h2>
        </div>
        <main className="max-w-[1200px] w-[90%] h-1/2 my-0 mx-auto mt-4 py-2">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-300">
                <th className="py-2 px-4">NO</th>
                <th className="py-2 px-4">Judul Buku</th>
                <th className="py-2 px-4">Tgl.Pinjam</th>
                <th className="py-2 px-4">Tgl.Pengembalian</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-500 text-white text-center">
                <td className="py-2 px-4 align-middle">1.</td>
                <td className="py-2 px-4 align-middle">Introduction</td>
                <td className="py-2 px-4 align-middle">07-11-2024</td>
                <td className="py-2 px-4 align-middle">11-11-2024</td>
                <td className="py-2 px-4 align-middle text-green-400">Sudah Dikembalikan</td>
              </tr>
              <tr className="bg-white text-center">
                <td className="py-2 px-4 align-middle">2.</td>
                <td className="py-2 px-4 align-middle">Financial Accounting</td>
                <td className="py-2 px-4 align-middle">07-11-2024</td>
                <td className="py-2 px-4 align-middle">11-11-2024</td>
                <td className="py-2 px-4 align-middle">Masih Dipinjan</td>
              </tr>
            </tbody>
          </table>
        </main>
      </section>
    </>
  );
}

export default Riwayat_Buku;