-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 04, 2025 at 11:56 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `library_information_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_staff`
--

CREATE TABLE `activity_staff` (
  `id_activity` bigint UNSIGNED NOT NULL,
  `id_staff` bigint UNSIGNED NOT NULL,
  `id_siswa` bigint UNSIGNED DEFAULT NULL,
  `kode_buku` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aktivitas` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_staff`
--

INSERT INTO `activity_staff` (`id_activity`, `id_staff`, `id_siswa`, `kode_buku`, `aktivitas`, `created_at`, `updated_at`) VALUES
(4, 1, NULL, 'B286', 'Menambahkan buku', '2025-02-11 19:27:51', '2025-02-11 19:27:51'),
(5, 1, NULL, 'B285', 'Menambahkan buku', '2025-02-11 19:35:35', '2025-02-11 19:35:35'),
(6, 1, NULL, 'B285', 'Mengupdate buku', '2025-02-11 19:41:30', '2025-02-11 19:41:30'),
(7, 1, NULL, 'B285', 'Mengupdate buku', '2025-02-11 20:09:11', '2025-02-11 20:09:11'),
(8, 1, 3, NULL, 'update status siswa', '2025-02-12 20:35:01', '2025-02-12 20:35:01');

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` bigint UNSIGNED NOT NULL,
  `kode_buku` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `judul` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pengarang` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `penerbit` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tahun_terbit` year NOT NULL,
  `deskripsi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto_buku` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stok` int NOT NULL DEFAULT '1',
  `lantai` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rak` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kategori` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `kode_buku`, `judul`, `pengarang`, `penerbit`, `tahun_terbit`, `deskripsi`, `foto_buku`, `stok`, `lantai`, `rak`, `kategori`, `created_at`, `updated_at`) VALUES
(1, 'B284', 'Pemrograman Berorientasi Objek', 'Jerrold Koch', 'Satterfield, Gerhold and O\'Keefe', 2015, 'Et ex suscipit omnis optio non rerum veritatis. Nostrum et dolore qui aut maxime aut non. Est adipisci officiis sint ut necessitatibus. Veniam adipisci impedit ea blanditiis.', 'path/to/foto.jpg', 18, '2', 'v6', 'Teknologi', '2025-02-11 19:12:50', '2025-02-11 19:12:50'),
(2, 'B697', 'Dasar-Dasar Algoritma', 'Arthur Konopelski', 'Huel-Schowalter', 1981, 'Placeat laudantium perferendis quo. Quae voluptatem debitis est culpa. Est perspiciatis debitis non ipsam reprehenderit. Voluptates enim impedit culpa aut est.', 'path/to/foto.jpg', 14, '2', 'h10', 'Teknologi', '2025-02-11 19:12:50', '2025-02-11 19:12:50'),
(3, 'B983', 'Kecerdasan Buatan untuk Pemula', 'Kayli Morar', 'Bogan LLC', 2016, 'Mollitia maiores consequuntur quo odio aliquid et cum. A sunt iste et iusto sit quos officiis.', 'path/to/foto.jpg', 18, '1', 'e9', 'Teknologi', '2025-02-11 19:12:50', '2025-02-11 19:12:50'),
(4, 'B744', 'Data Science dengan Python', 'Jason Aufderhar III', 'Torp, Waters and Gislason', 2020, 'Iusto veniam quia laborum inventore optio ut. Delectus pariatur et voluptatibus illo. Fugit recusandae maxime nisi suscipit velit.', 'path/to/foto.jpg', 20, '1', 'e6', 'Teknologi', '2025-02-11 19:12:50', '2025-02-11 19:12:50'),
(5, 'B104', 'Strategi Digital Marketing', 'Rodrick Schroeder', 'McClure, Fay and Pacocha', 2015, 'Sit omnis temporibus molestiae sed magni et adipisci. Quos non dolores molestias. Nihil eaque ipsa quo eligendi rerum maiores. Laborum deserunt eligendi voluptatem.', 'path/to/foto.jpg', 15, '2', 'r5', 'Teknologi', '2025-02-11 19:12:50', '2025-02-11 19:12:50'),
(6, 'B477', 'Pemrograman Web dengan Laravel', 'Madie Hermiston', 'Reichel-Mosciski', 2018, 'Explicabo in placeat id recusandae suscipit similique facere. Nemo ex eum sit exercitationem doloribus. Voluptas odit non qui tempora aliquid dolorum.', 'path/to/foto.jpg', 2, '2', 'f6', 'Teknologi', '2025-02-11 19:12:50', '2025-02-11 19:12:50'),
(7, 'B139', 'Keamanan Jaringan Komputer', 'Rozella Cremin', 'Ledner, Smith and Schoen', 2014, 'Voluptatem illum nostrum dolores delectus. Quibusdam et repellat dolores rerum magnam illum. Temporibus eius harum sapiente quidem. Dolor laboriosam id iusto qui.', 'path/to/foto.jpg', 14, '1', 'y2', 'Teknologi', '2025-02-11 19:12:50', '2025-02-11 19:12:50'),
(8, 'B777', 'Sistem Informasi Manajemen', 'Prof. Joshuah Gislason V', 'Kuhn PLC', 1971, 'Totam velit cupiditate consequatur eum. Est natus corporis aut sint. Expedita aut nostrum tempora dolore nam molestias.', 'path/to/foto.jpg', 11, '3', 'm8', 'Teknologi', '2025-02-11 19:12:50', '2025-02-11 19:12:50'),
(9, 'B556', 'Kecerdasan Buatan untuk Pemula', 'Dr. Ebony Veum', 'Torphy LLC', 1989, 'Odio voluptas reprehenderit beatae fuga laborum ea consectetur. Cumque odit natus dolor in consequatur quis placeat aut. Sapiente laboriosam ipsa consequatur nihil voluptas. Aut esse sed sed qui excepturi at temporibus.', 'path/to/foto.jpg', 2, '2', 'c6', 'Teknologi', '2025-02-11 19:12:50', '2025-02-11 19:12:50'),
(10, 'B538', 'Pemrograman Web dengan Laravel', 'Prof. Zachary Farrell', 'Wyman, Howell and Beer', 1979, 'Deserunt quas laudantium eius et repellat veniam in. Veritatis nulla vel optio tenetur sit sunt dicta. Velit sunt eum officiis. Recusandae quas accusamus non aspernatur corporis saepe mollitia eum.', 'path/to/foto.jpg', 3, '3', 'l7', 'Teknologi', '2025-02-11 19:12:50', '2025-02-11 19:12:50'),
(14, 'B286', 'Machine Learning', 'Alan Turing', 'England Article', 1945, 'asksksksksksks', NULL, 18, '2', 'v7', 'Teknologi', '2025-02-11 19:27:51', '2025-02-11 19:27:51'),
(15, 'B285', 'Machine Learning', 'Alan Turing', 'England Articles', 1945, 'ini adalah mesin yang bisa berpikir', NULL, 28, '2', 'v7', 'Teknologi', '2025-02-11 19:35:35', '2025-02-13 05:55:07');

-- --------------------------------------------------------

--
-- Table structure for table `borrowings`
--

CREATE TABLE `borrowings` (
  `id_peminjaman` bigint UNSIGNED NOT NULL,
  `id_siswa` bigint UNSIGNED NOT NULL,
  `tanggal_pinjam` date NOT NULL,
  `tanggal_pengembalian` date NOT NULL,
  `status` enum('dipinjam','dikembalikan','pending','ditolak') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `kode_buku` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `borrowings`
--

INSERT INTO `borrowings` (`id_peminjaman`, `id_siswa`, `tanggal_pinjam`, `tanggal_pengembalian`, `status`, `kode_buku`, `created_at`, `updated_at`) VALUES
(1, 3, '2025-02-19', '2025-02-25', 'dikembalikan', 'B285', '2025-02-12 22:05:38', '2025-02-13 03:54:20'),
(2, 3, '2025-02-19', '2025-02-25', 'dikembalikan', 'B285', '2025-02-12 22:06:26', '2025-02-13 04:19:19'),
(3, 3, '2025-02-19', '2025-02-25', 'dikembalikan', 'B285', '2025-02-13 04:19:44', '2025-02-13 04:30:01'),
(4, 3, '2025-02-19', '2025-02-25', 'dikembalikan', 'B285', '2025-02-13 04:25:18', '2025-02-13 04:30:07'),
(5, 3, '2025-02-19', '2025-02-25', 'dipinjam', 'B285', '2025-02-13 04:32:14', '2025-02-13 05:55:07');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fines`
--

CREATE TABLE `fines` (
  `id_denda` bigint UNSIGNED NOT NULL,
  `kode_buku` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_peminjaman` bigint UNSIGNED NOT NULL,
  `jumlah_denda` int NOT NULL,
  `status` enum('belum_bayar','sudah_bayar') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'belum_bayar',
  `tanggal_bayar` date NOT NULL,
  `tanggal_kembali` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `headperpustakaan`
--

CREATE TABLE `headperpustakaan` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_telepon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `headperpustakaan`
--

INSERT INTO `headperpustakaan` (`id`, `name`, `email`, `password`, `no_telepon`, `created_at`, `updated_at`) VALUES
(1, 'Napoleon', 'Napoleon@gmail.com', '$2y$12$oNPphQQozj93OIREzHi2ru5wuAgrXkMJ5zntHLxUjqw.C2oEhOFpS', '08993939392', '2025-02-12 19:20:12', '2025-02-12 19:20:12');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(37, '2014_10_12_000000_create_users_table', 1),
(38, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(39, '2019_08_19_000000_create_failed_jobs_table', 1),
(40, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(41, '2025_01_22_232328_create_books_table', 1),
(42, '2025_01_23_000310_create_students_table', 1),
(43, '2025_01_23_000622_create_borrowings_table', 1),
(44, '2025_01_23_001547_create_staff_table', 1),
(45, '2025_01_24_064056_create_fines_table', 1),
(46, '2025_01_29_075345_create_ratings_table', 1),
(47, '2025_02_04_031628_create_activity_staff_table', 1),
(48, '2025_02_12_105243_add_new_columns_to_staff_table', 2),
(49, '2025_02_13_003242_create_headperpustakaan_table', 3),
(50, '2025_02_13_015415_add_new_columns_to_staff_table', 4),
(53, '2025_02_13_042022_update_status_column_in_borrowings', 5);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\Staff', 2, 'staff-token', '609d5219cbf0467d010940357ce1b303fae2035ace267160abda2dabd755239b', '[\"staff\"]', NULL, NULL, '2025-03-03 02:32:47', '2025-03-03 02:32:47');

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` bigint UNSIGNED NOT NULL,
  `kode_buku` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_siswa` bigint UNSIGNED NOT NULL,
  `rating` tinyint UNSIGNED NOT NULL COMMENT 'Rating dari 1-5',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id_staff` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_telepon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `foto_profil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tanggal_daftar` date NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `hak_akses_CRUD` tinyint(1) NOT NULL DEFAULT '0',
  `hak_akses_approve` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id_staff`, `name`, `email`, `no_telepon`, `foto_profil`, `tanggal_daftar`, `password`, `created_at`, `updated_at`, `hak_akses_CRUD`, `hak_akses_approve`, `status`) VALUES
(1, 'Bima', 'Napoleon@gmail.com', '08939399921', NULL, '2025-02-11', '$2y$12$/V59flQ5ZeHQXIyOTURzsOcZEayoDUIL4SkfAYBSbQV83VcI5RSmW', '2025-02-11 00:00:44', '2025-02-17 02:19:28', 1, 0, 'pending'),
(2, 'Bambang', 'Bambang@gmail.com', '0893939992891', NULL, '2025-02-17', '$2y$12$aNDw7XKt9p9I8W/0d3n6lu6NK1a2v12.FeYgIZrll/lmr2i76EMlO', '2025-02-17 02:27:08', '2025-02-17 02:45:28', 0, 1, 'approved');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id_siswa` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_telepon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `foto_profil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tanggal_daftar` date NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id_siswa`, `name`, `email`, `no_telepon`, `foto_profil`, `tanggal_daftar`, `password`, `email_verified_at`, `status`, `created_at`, `updated_at`) VALUES
(2, 'Hannibal', 'Hannibal@gmail.com', '08939399920', NULL, '2025-02-11', '$2y$12$SBZvHZ4m7bmQzm81/Ji/oeoHo.24R..HNegznwWy1hRW6zOGKpXjm', NULL, 'approved', '2025-02-11 00:44:06', '2025-02-11 22:48:16'),
(3, 'Scipio', 'Scipio@gmail.com', '08939391011', NULL, '2025-02-12', '$2y$12$A6a1iJOALKKvOyewcaf4meLKJnFWC6GzfViCFuZERUB6t408YwsCq', NULL, 'approved', '2025-02-11 18:50:46', '2025-02-12 20:18:36'),
(20, 'Nicholas', 'nicholasdoloksaribu450@gmail.com', '08993528931', NULL, '2025-03-02', '$2y$12$wnLi8sO1BNgOYVj1KXH43O9bi93fP29RxGbTK4KxT/Fru8XkLbgPe', NULL, 'pending', '2025-03-02 01:34:37', '2025-03-02 01:34:37');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_staff`
--
ALTER TABLE `activity_staff`
  ADD PRIMARY KEY (`id_activity`),
  ADD KEY `activity_staff_id_staff_foreign` (`id_staff`),
  ADD KEY `activity_staff_id_siswa_foreign` (`id_siswa`),
  ADD KEY `activity_staff_kode_buku_foreign` (`kode_buku`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `books_kode_buku_unique` (`kode_buku`);

--
-- Indexes for table `borrowings`
--
ALTER TABLE `borrowings`
  ADD PRIMARY KEY (`id_peminjaman`),
  ADD KEY `borrowings_kode_buku_foreign` (`kode_buku`),
  ADD KEY `borrowings_id_siswa_foreign` (`id_siswa`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `fines`
--
ALTER TABLE `fines`
  ADD PRIMARY KEY (`id_denda`),
  ADD KEY `fines_kode_buku_foreign` (`kode_buku`),
  ADD KEY `fines_id_peminjaman_foreign` (`id_peminjaman`);

--
-- Indexes for table `headperpustakaan`
--
ALTER TABLE `headperpustakaan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `headperpustakaan_email_unique` (`email`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ratings_kode_buku_foreign` (`kode_buku`),
  ADD KEY `ratings_id_siswa_foreign` (`id_siswa`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id_staff`),
  ADD UNIQUE KEY `staff_email_unique` (`email`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id_siswa`),
  ADD UNIQUE KEY `students_email_unique` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_staff`
--
ALTER TABLE `activity_staff`
  MODIFY `id_activity` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `borrowings`
--
ALTER TABLE `borrowings`
  MODIFY `id_peminjaman` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fines`
--
ALTER TABLE `fines`
  MODIFY `id_denda` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `headperpustakaan`
--
ALTER TABLE `headperpustakaan`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id_staff` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id_siswa` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_staff`
--
ALTER TABLE `activity_staff`
  ADD CONSTRAINT `activity_staff_id_siswa_foreign` FOREIGN KEY (`id_siswa`) REFERENCES `students` (`id_siswa`) ON DELETE CASCADE,
  ADD CONSTRAINT `activity_staff_id_staff_foreign` FOREIGN KEY (`id_staff`) REFERENCES `staff` (`id_staff`) ON DELETE CASCADE,
  ADD CONSTRAINT `activity_staff_kode_buku_foreign` FOREIGN KEY (`kode_buku`) REFERENCES `books` (`kode_buku`) ON DELETE CASCADE;

--
-- Constraints for table `borrowings`
--
ALTER TABLE `borrowings`
  ADD CONSTRAINT `borrowings_id_siswa_foreign` FOREIGN KEY (`id_siswa`) REFERENCES `students` (`id_siswa`) ON DELETE CASCADE,
  ADD CONSTRAINT `borrowings_kode_buku_foreign` FOREIGN KEY (`kode_buku`) REFERENCES `books` (`kode_buku`) ON DELETE CASCADE;

--
-- Constraints for table `fines`
--
ALTER TABLE `fines`
  ADD CONSTRAINT `fines_id_peminjaman_foreign` FOREIGN KEY (`id_peminjaman`) REFERENCES `borrowings` (`id_peminjaman`) ON DELETE CASCADE,
  ADD CONSTRAINT `fines_kode_buku_foreign` FOREIGN KEY (`kode_buku`) REFERENCES `books` (`kode_buku`) ON DELETE CASCADE;

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_id_siswa_foreign` FOREIGN KEY (`id_siswa`) REFERENCES `students` (`id_siswa`) ON DELETE CASCADE,
  ADD CONSTRAINT `ratings_kode_buku_foreign` FOREIGN KEY (`kode_buku`) REFERENCES `books` (`kode_buku`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
