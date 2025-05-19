import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchData } from '../utils/api';
import { saveAccessToken } from '../utils/auth';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 Tambahan
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next');
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const result = await fetchData(`${API_URL}/api/loginStaff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const hakAkses = [];
    if (result.staff) {
      if (result.staff.hak_akses_CRUD === 1) {
        hakAkses.push('hak_akses_CRUD');
      }
      if (result.staff.hak_akses_approve === 1) {
        hakAkses.push('hak_akses_approve');
      }
      Cookies.set('access', 'staff');
    } else if (result.headperpustakaan) {
      Cookies.set('access', 'headperpustakaan');
      hakAkses.push(result.abilities);
    }

    if (result.status === 'success') {
      saveAccessToken(result.token, hakAkses, 10800); // 3 JAM
      if (next) {
        navigate(next);
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login to Your Account</h2>

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'} // 👈 Diubah
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 focus:outline-none"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-.717.076-1.42.223-2.098M7.05 7.05a3 3 0 014.243 0m0 0l2.829 2.829m-2.829-2.829a3 3 0 010 4.243m0 0l2.829 2.829M12 3c4.418 0 8.164 2.943 9.429 7-1.265 4.057-5.011 7-9.429 7-1.493 0-2.91-.375-4.171-1.038" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 7c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                </svg>
              )}
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
