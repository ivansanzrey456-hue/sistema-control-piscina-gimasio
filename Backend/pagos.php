<?php


// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
include 'conexion.php';

// Obtener la acción desde GET o POST
$accion = $_GET['accion'] ?? $_POST['accion'] ?? '';

// Obtener pagos del día
if ($accion === 'consultar_pagos_dia') {
    $sql = "SELECT * FROM pagos_dia ORDER BY fecha DESC, hora_entrada DESC";
    $result = $conexion->query($sql);

    $pagos = [];
    while ($row = $result->fetch_assoc()) {
        $pagos[] = $row;
    }

    echo json_encode($pagos);
    exit;
}
?>
