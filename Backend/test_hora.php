<?php
date_default_timezone_set('Etc/GMT+6');
$conexion = new mysqli('localhost', 'root', '12345678', 'piscina_bd');
$conexion->query("SET time_zone = '-06:00'");

echo "⏰ Hora PHP: " . date("Y-m-d H:i:s");

$res = $conexion->query("SELECT NOW() AS hora_mysql");
$row = $res->fetch_assoc();
echo "<br>🕒 Hora MySQL: " . $row['hora_mysql'];

?>
