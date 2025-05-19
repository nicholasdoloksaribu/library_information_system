import Cookies from 'js-cookie';

export const checkAccess = (path, setNotification) => {
    const userAbility = Cookies.get('ability');
    const decodedAbility = userAbility ? decodeURIComponent(userAbility) : '';
    const userAbilitiesArray = decodedAbility.split(',');

    const routePermissions = {
        '/dashboard': [],
        '/manajemen-buku': ['hak_akses_CRUD', 'hak_akses_approve'],
        '/detail-peminjaman': ['hak_akses_approve', 'hak_akses_CRUD'],
        '/persetujuan-peminjaman': ['hak_akses_approve'],
        '/persetujuan-anggota': ['hak_akses_approve'],
        '/persetujuan_anggota_staff': ['headperpustakaan'],
        '/data-anggota': ['hak_akses_approve'],
        '/data-staff': ['headperpustakaan'],
    };

    const allowedAbilities = routePermissions[path] || [];

    if (allowedAbilities.length === 0) {
        return true;
    }

    const hasAccess = allowedAbilities.some(allowed => userAbilitiesArray.includes(allowed));

    if (!hasAccess) {
        setNotification('Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman ini.');
        return false;
    }

    return true;
};