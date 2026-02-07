<?php
date_default_timezone_set('Etc/GMT+6'); // ✅ Fuerza CDMX sin DST

$host = 'localhost';
$usuario = 'usuario';
$clave = 'contraseñas';
$bd = 'bd';

$conexion = new mysqli($host, $usuario, $clave, $bd);

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

$conexion->query("SET time_zone = '-06:00'"); // ✅ MySQL en UTC-6 fijo
?>
