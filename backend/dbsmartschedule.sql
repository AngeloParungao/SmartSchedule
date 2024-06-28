-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 28, 2024 at 05:32 PM
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
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `schedule_id` int(11) NOT NULL,
  `instructor` varchar(50) NOT NULL,
  `subject` varchar(50) NOT NULL,
  `section_name` varchar(20) NOT NULL,
  `section_group` varchar(20) NOT NULL,
  `class_type` varchar(15) NOT NULL,
  `room` varchar(10) NOT NULL,
  `background_color` varchar(20) NOT NULL,
  `day` varchar(20) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` (`schedule_id`, `instructor`, `subject`, `section_name`, `section_group`, `class_type`, `room`, `background_color`, `day`, `start_time`, `end_time`) VALUES
(7, 'Clyde  Mondero', 'System Analysis and Design', 'BSIT 3D', 'Group 1', 'Laboratory', 'MML', '#fdafaf', 'Monday', '07:00:00', '10:00:00'),
(8, 'Albert  Junio', 'Quality Assurance', 'BSIT 3D', 'Group 1', 'Lecture', 'RM201', '#cba3e1', 'Wednesday', '08:00:00', '10:00:00'),
(9, 'Erick  Caleja', 'Quality Assurance', 'BSIT 3D', 'Group 1', 'Lecture', 'MML', '#bafdd1', 'Friday', '10:00:00', '12:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `section_id` int(11) NOT NULL,
  `section_name` varchar(15) NOT NULL,
  `section_group` varchar(15) NOT NULL,
  `year_lvl` varchar(20) NOT NULL,
  `number_of_students` int(100) NOT NULL,
  `section_tags` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`section_id`, `section_name`, `section_group`, `year_lvl`, `number_of_students`, `section_tags`) VALUES
(4, 'BSIT 3D', 'Group 2', '3rd Year', 23, 'masaya dito'),
(11, 'BSIT 3D', 'Group 1', '3rd Year', 17, '');

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
(7, 'Quality Assurance', 'IT309', '3rd Year', 'Major', 3, 'sample'),
(8, 'System Analysis and Design', 'SAD', '3rd Year', 'Major', 3, 'hard');

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
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`schedule_id`);

--
-- Indexes for table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`section_id`);

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
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `section_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
