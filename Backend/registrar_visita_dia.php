<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim($_POST['nombre']);
    $monto_pagado = floatval($_POST['monto_pagado']);
    $comentarios = trim($_POST['comentarios']);
    $registrado_por = isset($_POST['registrado_por']) ? trim($_POST['registrado_por']) : 'admin';

    if (empty($nombre) || empty($monto_pagado)) {
        echo json_encode(['status' => 'Error', 'mensaje' => 'Faltan datos obligatorios.']);
        exit;
    }

    if (!preg_match("/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]{2,50}$/", $nombre)) {
        echo json_encode(["status" => "Error", "mensaje" => "Nombre inválido. Solo letras y espacios."]);
        exit;
    }

    if ($monto_pagado <= 0 || $monto_pagado > 9999.99) {
        echo json_encode(["status" => "Error", "mensaje" => "Monto no válido."]);
        exit;
    }

    $fecha = date('Y-m-d');
    $hora = date('H:i:s');

    $query = "INSERT INTO pagos_dia (nombre, monto_pagado, comentarios, fecha, hora_entrada, registrado_por)
              VALUES (?, ?, ?, ?, ?, ?)";

    $stmt = $conexion->prepare($query);
    $stmt->bind_param("sdssss", $nombre, $monto_pagado, $comentarios, $fecha, $hora, $registrado_por);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'Éxito', 'mensaje' => 'Visita registrada correctamente']);
    } else {
        echo json_encode(['status' => 'Error', 'mensaje' => 'Error al registrar visita']);
    }

    $stmt->close();
    $conexion->close();
} else {
    echo json_encode(['status' => 'Error', 'mensaje' => 'Método no permitido']);
}
