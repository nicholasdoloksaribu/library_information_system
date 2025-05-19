import "./App.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBarComponent from "./components/NavBarComponent";
import UserNav from "./components/UserNav";
import Kartu from "./components/dashboard/Kartu";
import axios from "axios";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    total_buku: 0,
    total_kategori: 0,
    total_siswa_disetujui: 0,
    total_staf_disetujui: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/dashboard-summary`);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
        setError("Gagal memuat data dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
              <div className="max-w-full w-4xl my-0 mx-auto bg-white h-full py-2">
                <div className="w-full h-20 rounded-md shadow shadow-slate-400 bg-slate-700 flex items-center justify-center mb-1">
                  <h1 className="font-semibold text-2xl text-slate-200">
                    Welcome!!
                  </h1>
                </div>
                <div className="w-full h-22 p-1 flex gap-x-4 mb-1">
                  <Kartu
                    judul={"Total Buku"}
                    icon={"book-alt"}
                    nilai={dashboardData.total_buku}
                  ></Kartu>
                  <Kartu
                    judul={"Total Kategori"}
                    icon={"book-open"}
                    nilai={dashboardData.total_kategori}
                  ></Kartu>
                  <Kartu
                    judul={"Total Anggota"}
                    icon={"user"}
                    nilai={dashboardData.total_siswa_disetujui}
                  ></Kartu>
                  <Kartu
                    judul={"Total Staff"}
                    icon={"user"}
                    nilai={dashboardData.total_staf_disetujui}
                  ></Kartu>
                </div>
              </div>
            </section>
          </main>
        </div>
      </section>
    </>
  );
}

export default Dashboard;