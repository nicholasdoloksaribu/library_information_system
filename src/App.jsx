import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Login from "./Login";
import Daftar from "./Daftar";
import Daftarbuku from "./Daftar_Buku";
import PinjamanBuku from "./Pinjaman_Buku";
import Riwayat_Buku from "./Riwayat_Buku";
import DaftarList from "./Daftar_List";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/Daftar"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Daftar />
            </motion.div>
          }
        />
        <Route
          path="/Daftar_Buku"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Daftarbuku />
            </motion.div>
          }
        />
        <Route
          path="/Pinjaman_Buku"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PinjamanBuku />
            </motion.div>
          }
        />
        <Route
          path="/Riwayat_Buku"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Riwayat_Buku />
            </motion.div>
          }
        />
        <Route
          path="/Daftar_List"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DaftarList />
            </motion.div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;