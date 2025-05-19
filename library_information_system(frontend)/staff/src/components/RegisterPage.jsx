import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [noTelepon, setNoTelepon] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [fotoProfil, setFotoProfil] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const handleFotoProfilChange = (event) => {
        setFotoProfil(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (password !== confirmPassword) {
            setError('Password dan Konfirmasi Password tidak sama.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('no_telepon', noTelepon);
        formData.append('password', password);
        formData.append('foto_profil', fotoProfil);

        try {
            const result = await axios.post(`${API_URL}/api/registerstaff`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (result.data.status === 'success') {
                setSuccessMessage(result.data.message);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError(result.data.message || 'Terjadi kesalahan saat registrasi.');
            }
        } catch (error) {
            setError('Terjadi kesalahan jaringan atau server.');
            console.error('Error during registration:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                setError(Object.values(error.response.data.errors).flat().join(', '));
            } else if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">Create Your Account</h2>

                {error && (
                    <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                        <span className="font-semibold">Error:</span> {error}
                    </div>
                )}

                {successMessage && (
                    <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
                        <span className="font-semibold">Success:</span> {successMessage}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="name">
                            Nama Lengkap
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Nama lengkap Anda"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="noTelepon">
                            Nomor Telepon
                        </label>
                        <input
                            id="noTelepon"
                            type="tel"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Nomor telepon Anda"
                            value={noTelepon}
                            onChange={(e) => setNoTelepon(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-500 focus:outline-none"
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="relative">
                        <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                            Konfirmasi Password
                        </label>
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                            placeholder="********"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-9 text-gray-500 focus:outline-none"
                        >
                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="h-5 w-5" />
                        </button>
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="fotoProfil">
                            Foto Profil
                        </label>
                        <input
                            id="fotoProfil"
                            type="file"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            onChange={handleFotoProfilChange}
                            accept="image/*"
                            required
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Register
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Already have an account? <Link to="/" className="text-blue-600 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}