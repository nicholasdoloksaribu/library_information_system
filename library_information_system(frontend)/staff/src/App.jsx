import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { motion } from 'framer-motion';
import Dashboard from "./Dashboard";
import Manajemen_Buku from "./Manajemen_Buku";
import Detail_Peminjaman from "./Detail_Peminjaman"; 
import Persetujuan_Peminjaman from "./Persetujuan_Peminjaman"; 
import Persetujuan_Anggota from "./Persetujuan_Anggota"; 
import Persetujuan_Anggota_Staff from "./Persetujuan_Anggota_Staff"; 
import Data_Anggota from "./Data_Anggota"; 
import LoginPage from "./components/LoginPage";
import {checkAccess} from "./utils/checkAccess"; // pastikan checkAccess dipisah dalam utils (jika belum, bisa juga langsung ditulis di sini)
import Data_Staff from "./Data_Staff";
import { UnauthenticatedRoute } from "./utils/UnauthenticatedRoute";
import { AuthenticatedRoute } from "./utils/AuthenticatedRoute";
import Data_HeadPerpustakaan from "./Data_Headperpustakaan";
import RegisterPage from "./components/RegisterPage";

const FadeWrapper = ({ children }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UnauthenticatedRoute element={<FadeWrapper><LoginPage/></FadeWrapper>}/>} />
        <Route path="/register" element={<UnauthenticatedRoute element={<FadeWrapper><RegisterPage/></FadeWrapper>}/>} />
        <Route path="/dashboard" element={<AuthenticatedRoute element={<FadeWrapper><Dashboard/></FadeWrapper>}/>} />
        <Route path="/manajemen-buku" element={<AuthenticatedRoute element={<FadeWrapper><Manajemen_Buku/></FadeWrapper>} allowedAbilities={['hak_akses_CRUD']}/>} />
        <Route path="/detail-peminjaman" element={<AuthenticatedRoute element={<FadeWrapper><Detail_Peminjaman/></FadeWrapper>} allowedAbilities={['hak_akses_approve','hak_akses_CRUD']}/>} />
        <Route path="/persetujuan-peminjaman" element={<AuthenticatedRoute element={<FadeWrapper><Persetujuan_Peminjaman/></FadeWrapper>} allowedAbilities={['hak_akses_approve']}/>} />
        <Route path="/persetujuan-anggota" element={<AuthenticatedRoute element={<FadeWrapper><Persetujuan_Anggota/></FadeWrapper>} allowedAbilities={['hak_akses_approve']}/>} />
        <Route path="/persetujuan_anggota_staff" element={<AuthenticatedRoute element={<FadeWrapper><Persetujuan_Anggota_Staff/></FadeWrapper>} allowedAbilities={['headperpustakaan']}/>} />
        <Route path="/data-anggota" element={<AuthenticatedRoute element={<FadeWrapper><Data_Anggota/></FadeWrapper>} allowedAbilities={['hak_akses_approve']}/>} />
        <Route path="/data-staff" element={<AuthenticatedRoute element={<FadeWrapper><Data_Staff/></FadeWrapper>} allowedAbilities={['headperpustakaan']} />} />
        <Route path="/data_headperpustakaan" element={<AuthenticatedRoute element={<FadeWrapper><Data_HeadPerpustakaan/></FadeWrapper>} allowedAbilities={['headperpustakaan']} />} />
      </Routes>
    </Router>
  );
}

export default App;
