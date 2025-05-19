import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { LogoutComponent } from './LogoutComponent';
import { Notification } from './Notification';
import MenuComponent from './MenuComponent';

export default function NavBarComponent() {
    const [NavOpen, setIsNavOpen] = useState(true);
    const [notification, setNotification] = useState(null);

    const navigate = useNavigate();

    const menuConfig = [
        [{ label: 'Dashboard', path: '/dashboard', icon: 'bx bxs-dashboard' }],
        ['Pengelolaan Buku',
            [{ label: 'Manajemen Buku', path: '/manajemen-buku', icon: 'bx bxs-book-open', requiredAbilities: ['hak_akses_CRUD'] }],
            { icon: 'bx bxs-book' }
        ],
        ['Pengelolaan Peminjaman',
            [
                { label: 'Detail Peminjaman', path: '/detail-peminjaman', icon: 'bx bx-file', requiredAbilities: ['hak_akses_approve', 'hak_akses_CRUD'] },
                { label: 'Persetujuan Peminjaman', path: '/persetujuan-peminjaman', icon: 'bx bx-check-double', requiredAbilities: ['hak_akses_approve'] },
            ],
            { icon: 'bx bxs-grid' }
        ],
        ['Pengelolaan Anggota',
            [
                { label: 'Data Anggota', path: '/data-anggota', icon: 'bx bxs-group', requiredAbilities: ['hak_akses_approve'] },
                { label: 'Persetujuan Anggota', path: '/persetujuan-anggota', icon: 'bx bx-user-check', requiredAbilities: ['hak_akses_approve'] },
            ],
            { icon: 'bx bxs-user' }
        ],
        ['Pengelolaan Staff',
            [
                { label: 'Persetujuan Anggota Staff', path: '/persetujuan_anggota_staff', icon: 'bx bx-user-plus', requiredAbilities: ['headperpustakaan'] },
                { label: 'Data Staff', path: '/data-staff', icon: 'bx bxs-id-card', requiredAbilities: ['headperpustakaan'] },
            ],
            { icon: 'bx bxs-id-card' }
        ],
    ];

    return (
        <>
            {notification && <Notification message={notification} onClose={() => setNotification(null)} />}

            <div
                className={`bg-slate-900 ${NavOpen ? "left-74" : "left-5"} absolute z-10 w-10 h-10 text-white flex items-center justify-center rounded-3xl top-3 transition-all duration-300`}>
                <i className="bx bx-menu text-2xl cursor-pointer" onClick={() => setIsNavOpen(!NavOpen)}></i>
            </div>
            <nav className={`bg-slate-700 ${NavOpen ? "flex-1" : "w-0 overflow-hidden"} h-full relative transition-all duration-300`}>
                <h1 className="text-3xl font-bold text-center pt-4 mb-4 text-white">Perpustakaan</h1>
                <MenuComponent menuItems={menuConfig} setNotification={setNotification} />

                <footer className="absolute bottom-0 w-full bg-slate-600 flex items-center h-13 pl-3 text-slate-300 cursor-pointer">
                    <i className="bx bx-log-out font-semibold text-xl mr-2"></i>
                    <LogoutComponent />
                </footer>
            </nav>
        </>
    );
}