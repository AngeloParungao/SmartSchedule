-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 16, 2024 at 02:25 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbsmartschedule`
--

-- --------------------------------------------------------

--
-- Table structure for table `instructors`
--

CREATE TABLE `instructors` (
  `instructor_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `middlename` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `worktype` varchar(20) NOT NULL,
  `tags` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructors`
--

INSERT INTO `instructors` (`instructor_id`, `email`, `firstname`, `middlename`, `lastname`, `worktype`, `tags`) VALUES
(20, 'angeloparungao.ap@gmail.com', 'Angelo Miguel', 'Lapuz', 'Parungao', 'regular', 'Web and Mobile Development'),
(23, 'clyde@gmail.com', 'Clyde', '', 'Mondero', 'Part-timer', 'Web and Mobile Development'),
(25, 'danrick@gmail.com', 'Danrick Salamat', 'Conception', 'Macatanong', 'Part-timer', 'Web and Mobile Development'),
(26, 'albert@gmail.com', 'Albert', '', 'Junio', 'Part-timer', 'Business Analytics'),
(27, 'erick@gmail.com', 'Erick', '', 'Caleja', 'part-timer', 'Business Analytics'),
(28, 'andrei@gmail.com', 'Andrei John', '', 'Poma', 'Part-timer', 'Web and Mobile Development'),
(29, 'maika@gmail.com', 'Maika', '', 'Ybiza', 'regular', 'Business Analytics'),
(30, 'maybilene@gmail.com', 'Maybilene', '', 'Bonifacio', 'Part-timer', 'Business Analytics'),
(33, 'test@gmail.com', 'test', 'test', 'test', 'regular', 'test');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `room_id` int(11) NOT NULL,
  `room_type` varchar(20) NOT NULL,
  `room_name` varchar(20) NOT NULL,
  `room_tags` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`room_id`, `room_type`, `room_name`, `room_tags`) VALUES
(28, 'Lecture', 'RM201', 'Second Floor'),
(29, 'Laboratory', 'MML', 'Multi Media Laboratory');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL,
  `subject_name` varchar(50) NOT NULL,
  `subject_code` varchar(20) NOT NULL,
  `year_lvl` varchar(10) NOT NULL,
  `subject_type` varchar(10) NOT NULL,
  `subject_units` int(5) NOT NULL,
  `subject_tags` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`subject_id`, `subject_name`, `subject_code`, `year_lvl`, `subject_type`, `subject_units`, `subject_tags`) VALUES
(7, 'Quality Assurance', 'IT309', '3rd Year', 'Major', 3, 'sample');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password`) VALUES
(1, 'sample@gmail.com', 'sample123');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `instructors`
--
ALTER TABLE `instructors`
  ADD PRIMARY KEY (`instructor_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`room_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `instructors`
--
ALTER TABLE `instructors`
  MODIFY `instructor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
