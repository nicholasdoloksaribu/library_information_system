import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import "./index.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/Daftar_Buku");
  };

  return (
    <>
      <header className="text-center py-4 mb-10">
        <h1 className="text-3xl font-bold tracking-wide text-white">
          Perpustakaan
        </h1>
      </header>
      <section>
        <div className="text-black max-w-sm w-full h-[400px] my-0 mx-auto rounded-xl bg-white flex flex-col gap-y-5">
          <h1 className="font-semibold text-2xl text-center pt-8">
            Login Anggota
          </h1>
          <form action="#" className="h-full flex flex-col gap-y-5" onSubmit={handleLogin}>
            <div className="w-full text-center h-11 mt-4">
              <input
                type="text"
                placeholder="NIM"
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
            <div className="pl-10">
              <a href="#" className="hover:text-blue-700">
                Lupa kata sandi?
              </a>
            </div>
            <div className="w-full h-11 text-center">
              <button
                type="submit"
                className="bg-sky-400 text-white font-semibold w-[80%] h-full rounded-xl cursor-pointer hover:opacity-70"
              >
                Log In
              </button>
            </div>
            <div className="text-center">
              <p>
                Belum punya akun?{" "}
                <Link to="/Daftar" className="underline text-blue-700">
                  Daftar disini
                </Link>{" "}
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default Login;