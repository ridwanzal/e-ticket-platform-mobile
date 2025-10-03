-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 15, 2025 at 01:16 AM
-- Server version: 8.0.39
-- PHP Version: 8.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_eibucerdas`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth`
--

CREATE TABLE `auth` (
  `id` int NOT NULL,
  `credential` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  `role` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `auth`
--

INSERT INTO `auth` (`id`, `credential`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2a$12$j/iA8EdMvGnDBRUFeyHQUuaQjivrHXzqDqzpZNySGMjbB.m.PQ2Um', 1, '2023-01-05 04:06:03', '2023-01-05 04:06:03');

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int NOT NULL,
  `author_id` int NOT NULL,
  `title` text NOT NULL,
  `content` text NOT NULL,
  `tag` text NOT NULL,
  `thumbnail` text NOT NULL,
  `slug` text NOT NULL,
  `uploader_name` varchar(256) NOT NULL,
  `total_seen` int DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `author_id`, `title`, `content`, `tag`, `thumbnail`, `slug`, `uploader_name`, `total_seen`, `created_at`, `updated_at`) VALUES
(2, 1, 'Antisipasi Jemaah Terpisah Mahram dan Pendamping, Kemenag Upayakan One Syarikah-One Kloter', 'Jakarta (PHU) - Kementerian Agama menyiapkan sejumlah langkah dalam memastikan jemaah haji gelombang II tidak terpisah dari pasangan dan pendampingnya. Salah satu upaya yang dilakukan adalah penataan kloter. Kementerian Agama menerapkan prinsip satu syarikah untuk satu kelompok terbang (kloter) secara ketat mulai gelombang II, terkecuali dalam kondisi darurat yang tak terhindarkan. “Kami akan menerapkan one syarikah - one kloter secara ketat. Langkah ini kami ambil untuk mempermudah koordinasi antara petugas kloter, sektor, dan pihak syarikah, ungkap Direktur Jenderal Penyelenggaraan Haji dan Umrah (Dirjen PHU) Hilman Latief saat hadir dalam Rapat Dengar Pendapat (RDP) bersama Komisi VIII DPR RI di Gedung Nusantara II DPR RI, Jakarta, pada Senin (19/5/2025). Selain penataan kloter, Hilman juga menyebutkan langkah-langkah lain seperti penjadwalan keberangkatan dan sinkronisasi data. Kebijakan ini juga akan memudahkan syarikah dalam menjangkau dan melayani jemaahnya. Pemberangkatan jemaah haji ke Makkah adalah berbasis syarikah, sehingga mengakibatkan terjadinya pecah kloter dan terpisah mahram (suami-istri, anak-orang tua, dan lansia-pendamping). “Untuk memberikan fleksibilitas yang lebih baik, jadwal keberangkatan akan kami serahkan kepada syarikah 48 jam sebelumnya, dengan perubahan maksimal 1096 yang diperbolehkan dalam waktu kurang dari 24 jam,\" terang Hilman dalam paparannya. Selain itu, Kementerian Agama juga memastikan pengiriman data manifest keberangkatan yang akurat dan tepat waktu kepada pihak syarikah. Dengan strategi ini, Hilman berharap dapat mencegah terjadinya ketidaksesuaian data yang seringkali menimbulkan permasalahan logistik dan administrasi di lapangan. “Ketepatan dan keakuratan data manifest ini krusial. Kami pastikan data akan dikirim paling lambat 15 jam sebelum kedatangan jemaah di Makkah untuk menghindari kebingungan di lapangan, jelasnya. Untuk memastikan kelancaran pergerakan dan penempatan jemaah, Hilman menyebut pihaknya terus melakukan koordinasi intensif dengan berbagai pihak terkait di Arab Saudi, termasuk Kementerian Haji Arab Saudi dan penyedia layanan transportasi serta akomodasi.', 'jamaah,umroh', '1753520969458-635471245.jpg', 'antisipasi-jemaah-terpisah-mahram-dan-pendamping-kemenag-upayakan-one-syarikah-one-kloter', 'M. Ridwan Zalbina', 0, '2025-07-26 16:09:29', '2025-07-27 08:06:15');

-- --------------------------------------------------------

--
-- Table structure for table `campaign`
--

CREATE TABLE `campaign` (
  `id` int NOT NULL,
  `context` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` int NOT NULL,
  `service_id` varchar(1) NOT NULL,
  `nama_lengkap` varchar(128) NOT NULL,
  `phone` text NOT NULL,
  `email` varchar(128) NOT NULL,
  `budget_est` varchar(1) NOT NULL,
  `description` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `id` int NOT NULL,
  `filename` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('My42BHXaksdoJNOmBW7hgzg9PBkFbl3f', 1754797315, '{\"cookie\":{\"originalMaxAge\":43200000,\"expires\":\"2025-08-09T19:24:50.393Z\",\"httpOnly\":true,\"path\":\"/\"}}'),
('aIg06hbnUEnz4_mw88lTnUhC3hyOheAY', 1754834243, '{\"cookie\":{\"originalMaxAge\":43200000,\"expires\":\"2025-08-10T11:41:14.343Z\",\"httpOnly\":true,\"path\":\"/\"}}');

-- --------------------------------------------------------

--
-- Table structure for table `umroh`
--

CREATE TABLE `umroh` (
  `id` int NOT NULL,
  `name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `subtitle` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `thumbnail` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tanggal` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `total_hari` int NOT NULL,
  `jenis_penerbangan` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `maskapai` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `hotel_makkah` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `hotel_madinah` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `hotel_makkah_star` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `hotel_madinah_star` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `paket` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `harga` int NOT NULL,
  `deskripsi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tagline` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `starting_from` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `slug` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `umroh`
--

INSERT INTO `umroh` (`id`, `name`, `subtitle`, `thumbnail`, `tanggal`, `total_hari`, `jenis_penerbangan`, `maskapai`, `hotel_makkah`, `hotel_madinah`, `hotel_makkah_star`, `hotel_madinah_star`, `paket`, `harga`, `deskripsi`, `tagline`, `starting_from`, `slug`, `created_at`, `updated_at`) VALUES
(3, 'Paket Umroh Plus Thaif Agustus 2025', 'Free Tour Umroh Se Indonesia', '1753949177021-5239403.png', '2025-07-31', 9, 'direct', 'Saudi Airliness', 'Maysan Al Mashaer', 'Golden Tulip', '4', '4', 'bronze', 31000000, '✅ Kereta Cepat\r\n✅ Free kenangan Frame Dokumentasi\r\n✅ Mutowwif Mahasiswa Madinah / Egypt\r\n✅ City Tour Thaif\r\n✅ Pesawat Pulang-Pergi\r\n✅ Visa Umroh\r\n✅ Hotel Mekkah dan Madinah\r\n✅ Bus Full AC\r\n✅ Pembimbing & Muthawwif\r\n✅ Manasik Umroh\r\n✅ City Tour Makkah & Madinah\r\n✅ Handing\r\n✅ Perlengkapan Umroh \r\n✅ Nasi Mandhi Romansiah\r\n✅ Zam-zam water', 'Paket Umroh Terbaik 2025', 'Jakarta', 'paket-umroh-plus-thaif-agustus-2025', '1753949177033', '1753949177033'),
(4, 'Paket Umroh Agustus Thaif 2025 Plus', 'Free Tour Umroh', '1754261211500-881293694.png', '2025-08-30', 9, 'direct', 'Emirates', 'Maysan Al Mashaer', 'Golden Tulip', '1', '1', 'bronze', 31000000, 'Karena selain beribadah, jamaah juga diajak menelusuri jejak dakwah Rasulullah SAW di kota sejuk nan bersejarah yang memperkaya pengalaman spiritual terbaik.\r\n\r\n', 'Paket Umroh Terbaik 2025', 'Jakarta', 'paket-umroh-agustus-thaif-2025-plus', '1754402131943', '1754402131943');

-- --------------------------------------------------------

--
-- Table structure for table `umroh_gratis`
--

CREATE TABLE `umroh_gratis` (
  `id` bigint NOT NULL,
  `nama` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone_number` varchar(32) NOT NULL,
  `domisili` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `jawaban` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `umroh_gratis`
--

INSERT INTO `umroh_gratis` (`id`, `nama`, `phone_number`, `domisili`, `jawaban`, `created_at`, `updated_at`) VALUES
(1754208538186, 'asdsadsa', '0811232313213', 'jakarta', 'helo nice', '2025-08-03T08:08:58.186Z', 1754208538),
(1754208743874, 'asdsadsa', '0811232313213', 'jakarta', 'helo niceasd', '2025-08-03T08:12:23.874Z', 1754208743),
(1754208758602, 'asdsadsa', '0811232313213', 'jakarta', 'helo niceasd', '2025-08-03T08:12:38.602Z', 1754208758);

-- --------------------------------------------------------

--
-- Table structure for table `umroh_gratis_uploads`
--

CREATE TABLE `umroh_gratis_uploads` (
  `id` bigint NOT NULL,
  `id_umroh_gratis` bigint NOT NULL,
  `thumnbnail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `umroh_gratis_uploads`
--

INSERT INTO `umroh_gratis_uploads` (`id`, `id_umroh_gratis`, `thumnbnail`, `created_at`) VALUES
(1, 1754208538186, '/uploads/1754208538186/img_0.jpg', 1754208538),
(2, 1754208538186, '/uploads/1754208538186/img_1.jpg', 1754208538),
(3, 1754208743874, '/uploads/1754208743874/img_0.jpg', 1754208743),
(4, 1754208743874, '/uploads/1754208743874/img_1.jpg', 1754208743),
(5, 1754208758602, '/uploads/1754208758602/img_0.jpg', 1754208758),
(6, 1754208758602, '/uploads/1754208758602/img_1.jpg', 1754208758);

-- --------------------------------------------------------

--
-- Table structure for table `uploads`
--

CREATE TABLE `uploads` (
  `id` int NOT NULL,
  `filename` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `uploads`
--

INSERT INTO `uploads` (`id`, `filename`, `created_at`) VALUES
(5, '1747807515413.png', '2025-05-21 06:05:15'),
(6, '1747807519326.png', '2025-05-21 06:05:19'),
(7, '1747813693768.jpg', '2025-05-21 07:48:13');

-- --------------------------------------------------------

--
-- Table structure for table `visa`
--

CREATE TABLE `visa` (
  `id` int NOT NULL,
  `name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `days_info` int NOT NULL,
  `price` int NOT NULL,
  `details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth`
--
ALTER TABLE `auth`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `campaign`
--
ALTER TABLE `campaign`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `umroh`
--
ALTER TABLE `umroh`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `umroh_gratis`
--
ALTER TABLE `umroh_gratis`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `umroh_gratis_uploads`
--
ALTER TABLE `umroh_gratis_uploads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `uploads`
--
ALTER TABLE `uploads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `visa`
--
ALTER TABLE `visa`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth`
--
ALTER TABLE `auth`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `campaign`
--
ALTER TABLE `campaign`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1977;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `umroh`
--
ALTER TABLE `umroh`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `umroh_gratis`
--
ALTER TABLE `umroh_gratis`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1754208758603;

--
-- AUTO_INCREMENT for table `umroh_gratis_uploads`
--
ALTER TABLE `umroh_gratis_uploads`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `uploads`
--
ALTER TABLE `uploads`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `visa`
--
ALTER TABLE `visa`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
