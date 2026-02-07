-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 07-02-2026 a las 00:41:29
-- Versión del servidor: 8.0.17
-- Versión de PHP: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `piscina_bd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos_dia`
--

CREATE TABLE `pagos_dia` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `monto_pagado` decimal(8,2) NOT NULL,
  `comentarios` text,
  `fecha` date NOT NULL,
  `hora_entrada` time NOT NULL,
  `registrado_por` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `pagos_dia`
--

INSERT INTO `pagos_dia` (`id`, `nombre`, `monto_pagado`, `comentarios`, `fecha`, `hora_entrada`, `registrado_por`) VALUES
(1, 'Pedro Olvera Moises', '40.00', 'Visita', '2025-07-17', '20:57:12', 'admin'),
(2, 'Memo Aponte', '40.00', '', '2025-07-17', '21:09:18', 'admin'),
(3, 'Alan Martinez Judio', '40.00', 'Visita', '2025-07-20', '00:27:33', 'admin'),
(4, 'Ivan', '40.00', 'nadar', '2025-07-20', '01:22:27', 'admin'),
(5, 'Luisa', '40.00', 'nadar', '2025-07-20', '01:25:34', 'admin'),
(6, 'Julio', '40.00', 'nnnn', '2025-07-20', '01:42:24', 'admin'),
(7, 'lola', '40.00', 'ssss', '2025-07-20', '01:47:19', 'admin'),
(8, 'Mario', '40.00', 'its my mario', '2025-07-19', '20:55:03', 'admin'),
(9, 'Luigui', '40.00', 'ok', '2025-07-19', '21:01:32', 'admin'),
(10, 'Eliot', '40.00', 'holi', '2025-07-21', '18:17:23', 'admin'),
(11, 'Mario', '40.00', 'its my mario', '2025-07-22', '13:40:40', 'admin'),
(12, 'Mailo', '40.00', 'Practicar', '2025-07-22', '13:41:33', 'admin'),
(13, 'juan', '40.00', '', '2025-07-22', '13:46:10', 'admin'),
(14, 'Maria', '40.00', 'sabe', '2025-07-22', '14:08:24', 'admin'),
(15, 'Lusi', '40.00', '', '2025-07-22', '18:16:28', 'admin'),
(16, 'Leon', '40.00', 'S\'Kennedy', '2025-07-22', '23:19:03', 'admin'),
(17, 'Jenifer', '40.00', 'La hora esta adelantada con 1', '2025-07-22', '18:32:19', 'admin'),
(18, 'Mirella', '40.00', '', '2025-07-22', '17:38:12', 'admin');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos_membresia`
--

CREATE TABLE `pagos_membresia` (
  `id` int(11) NOT NULL,
  `socio_id` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` date NOT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL,
  `registrado_por` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `pagos_membresia`
--

INSERT INTO `pagos_membresia` (`id`, `socio_id`, `monto`, `fecha_pago`, `metodo_pago`, `registrado_por`) VALUES
(1, 32, '300.00', '2025-07-22', 'Efectivo', 'admin'),
(2, 36, '300.00', '2025-07-22', 'Efectivo', 'admin'),
(3, 36, '300.00', '2025-07-22', 'Efectivo', 'admin'),
(4, 32, '300.00', '2025-07-22', 'Efectivo', 'admin'),
(5, 37, '300.00', '2025-07-22', 'Transferencia', 'admin'),
(6, 27, '400.00', '2025-09-01', 'Efectivo', 'admin'),
(7, 26, '350.00', '2025-09-15', 'Efectivo', 'admin'),
(8, 26, '300.00', '2025-10-18', 'Efectivo', 'admin');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registros_acceso`
--

CREATE TABLE `registros_acceso` (
  `id` int(11) NOT NULL,
  `socio_id` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora_entrada` datetime DEFAULT NULL,
  `hora_salida` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `registros_acceso`
--

INSERT INTO `registros_acceso` (`id`, `socio_id`, `fecha`, `hora_entrada`, `hora_salida`) VALUES
(1, 26, '2025-07-14', '2025-07-14 14:34:37', '2025-07-14 14:44:44'),
(2, 28, '2025-07-14', '2025-07-14 14:53:09', '2025-07-14 14:53:58'),
(3, 27, '2025-07-14', '2025-07-14 14:58:07', '2025-07-14 14:59:17'),
(4, 26, '2025-07-15', '2025-07-15 09:13:36', '2025-07-15 14:27:26'),
(6, 28, '2025-07-19', '2025-07-19 20:14:43', '2025-07-19 20:17:25'),
(7, 31, '2025-07-20', '2025-07-20 15:29:57', NULL),
(8, 31, '2025-07-21', '2025-07-21 17:16:14', '2025-07-21 17:16:39'),
(9, 30, '2025-07-22', '2025-07-22 12:44:45', '2025-07-22 12:50:40'),
(10, 27, '2025-07-22', '2025-07-22 14:09:28', '2025-07-22 17:31:10'),
(11, 28, '2025-07-22', '2025-07-22 17:22:47', '2025-07-22 17:40:24'),
(12, 31, '2026-02-06', '2026-02-06 15:40:17', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `socios`
--

CREATE TABLE `socios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido_paterno` varchar(100) DEFAULT NULL,
  `apellido_materno` varchar(100) DEFAULT NULL,
  `correo` varchar(100) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `fecha_registro` date NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `edad` int(11) NOT NULL,
  `membresia_activa` tinyint(1) DEFAULT '1',
  `fecha_vencimiento` date DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `socios`
--

INSERT INTO `socios` (`id`, `nombre`, `apellido_paterno`, `apellido_materno`, `correo`, `telefono`, `fecha_registro`, `fecha_nacimiento`, `edad`, `membresia_activa`, `fecha_vencimiento`, `foto_perfil`) VALUES
(26, 'Elizabeth', 'Gillies', 'Wested', 'eli@gmail.com', '8080818745', '2025-06-06', '1991-06-18', 34, 0, '2025-11-18', 'uploads/foto_686ab97e9ab46.jpg'),
(27, 'Jhonny', 'Christopher', 'Depp', 'depp@gmail.com', '7121546934', '2025-07-08', '1963-07-12', 61, 0, '2025-10-01', 'uploads/foto_686c75943ede0.jpg'),
(28, 'Gael', 'Garcia', 'Bernal', 'gage@gmail.com', '4271837039', '2025-07-08', '1982-07-13', 42, 0, '2025-08-08', 'uploads/foto_686d3654c68de.jpg'),
(29, 'Diego', 'Garcia', 'Luna', 'luna@gmail.com', '5632749966', '2025-07-08', '2002-02-19', 23, 0, '2025-08-08', 'uploads/foto_686d82776f37c.jpg'),
(30, 'Ivan', 'Sanchez', 'Reyes', 'zensvan23@gmail.com', '7122996549', '2025-07-14', '2003-01-07', 22, 0, '2025-08-14', 'uploads/foto_6875705eb38ce.jpg'),
(31, 'Fede', 'De', 'Lobos', 'fede@gamil.com', '8833665542', '2025-07-17', '1996-01-30', 29, 0, '2025-08-17', 'uploads/foto_687d5f0d8ba77.jpeg'),
(32, 'Mc', 'Clovin', 'Hawai', 'mclovin@gmail.com', '9966332201', '2025-07-17', '1994-07-07', 31, 0, '2025-08-22', 'uploads/foto_687ec49e09997.jpeg'),
(36, 'Victoria', 'Dawn', 'Justice', 'vic@gamil.com', '5544663322', '2025-07-21', '1993-02-19', 32, 0, '2025-08-22', 'uploads/foto_687eca0770b3c.jpg'),
(37, 'Jhonn', 'Cena', 'Frijoles', 'jhon@gmail.com', '8855447722', '2025-07-22', '1984-01-26', 41, 0, '2025-08-22', 'uploads/foto_687fdeb2435d6.jpeg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido_paterno` varchar(50) DEFAULT NULL,
  `apellido_materno` varchar(50) DEFAULT NULL,
  `correo` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `telefono` varchar(10) DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `rol` enum('admin','encargado') NOT NULL DEFAULT 'encargado',
  `estatus` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `foto_perfil` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido_paterno`, `apellido_materno`, `correo`, `password`, `creado_en`, `telefono`, `fecha_ingreso`, `rol`, `estatus`, `foto_perfil`) VALUES
(1, 'Lucaz', 'Jonas', 'Depp', 'luca@gmail.com', '$2y$10$PI76FeRL0vkJzwQDXYx5henr4T9ErT.zfJUBFtMhqTCs1eyljc4jm', '2025-07-01 02:12:33', '5472819945', '2025-07-03', 'encargado', 'activo', NULL),
(11, 'Admin', 'Principal', 'Root', 'admin123@gmail.com', '$2y$10$QYTeZOYGU9Zo6HHUUV4sGOoygc.L0nQ8/87hhIsHu2dIO2dRh6cga', '2025-09-01 20:13:38', '0000000000', '2025-09-01', 'admin', 'activo', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pagos_dia`
--
ALTER TABLE `pagos_dia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pagos_membresia`
--
ALTER TABLE `pagos_membresia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `socio_id` (`socio_id`);

--
-- Indices de la tabla `registros_acceso`
--
ALTER TABLE `registros_acceso`
  ADD PRIMARY KEY (`id`),
  ADD KEY `socio_id` (`socio_id`);

--
-- Indices de la tabla `socios`
--
ALTER TABLE `socios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pagos_dia`
--
ALTER TABLE `pagos_dia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `pagos_membresia`
--
ALTER TABLE `pagos_membresia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `registros_acceso`
--
ALTER TABLE `registros_acceso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `socios`
--
ALTER TABLE `socios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pagos_membresia`
--
ALTER TABLE `pagos_membresia`
  ADD CONSTRAINT `pagos_membresia_ibfk_1` FOREIGN KEY (`socio_id`) REFERENCES `socios` (`id`);

--
-- Filtros para la tabla `registros_acceso`
--
ALTER TABLE `registros_acceso`
  ADD CONSTRAINT `registros_acceso_ibfk_1` FOREIGN KEY (`socio_id`) REFERENCES `socios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
