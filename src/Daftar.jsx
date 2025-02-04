import { Link } from "react-router-dom";
import "./App.css";
import "./index.css";

function Daftar() {
  return (
    <>
      <header className="text-center py-3 mb-2">
        <h1 className="text-3xl font-bold tracking-wide text-white">
          Perpustakaan
        </h1>
      </header>
      <section>
        <div className="text-black max-w-sm w-full h-[470px] my-0 mx-auto rounded-xl bg-white flex flex-col gap-y-2">
          <h1 className="font-semibold text-2xl text-center pt-2">
            Registrasi
          </h1>
          <form action="#" className="flex flex-col gap-y-1">
            <div className="w-full text-center h-11 mt-1">
              <input
                type="text"
                placeholder="Nama"
                className="w-[80%] h-full border-b-2 border-blue-300 pl-2 text-md tracking-wide outline-0"
              />
            </div>
            <div className="w-full text-center h-11">
              <input
                type="text"
                placeholder="NIM"
                className="w-[80%] h-full border-b-2 border-blue-300 pl-2 text-md tracking-wide outline-0"
              />
            </div>
            <div className="w-full text-center h-11">
              <input
                type="text"
                placeholder="Jurusan"
                className="w-[80%] h-full border-b-2 border-blue-300 pl-2 text-md tracking-wide outline-0"
              />
            </div>
            <div className="w-full text-center h-11">
              <input
                type="email"
                placeholder="Email"
                className="w-[80%] h-full border-b-2 border-blue-300 pl-2 text-md tracking-wide outline-0"
              />
            </div>
            <div className="w-full text-center h-11">
              <input
                type="text"
                placeholder="No.telp"
                className="w-[80%] h-full border-b-2 border-blue-300 pl-2 text-md tracking-wide outline-0"
              />
            </div>
            <div className="w-full text-center h-11">
              <input
                type="password"
                placeholder="Password"
                className="w-[80%] h-full border-b-2 border-blue-300 pl-2 text-md tracking-wide outline-0"
              />
            </div>
            <div className="w-full text-center h-11">
              <input
                type="password"
                placeholder="Re-password"
                className="w-[80%] h-full border-b-2 border-blue-300 pl-2 text-md tracking-wide outline-0"
              />
            </div>
            <div className="w-full h-11 text-center mt-2">
              <button
                type="submit"
                className="bg-sky-400 text-white font-semibold w-[80%] h-full rounded-xl cursor-pointer hover:opacity-70"
              >
                Daftar
              </button>
            </div>
            <div className="text-center">
              <p>
                Sudah punya akun?{" "}
                <Link to="/" className="underline text-blue-700">
                  Login disini
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default Daftar;