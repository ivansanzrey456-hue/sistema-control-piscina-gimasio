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

try {
    $sql = "SELECT r.id, r.fecha, r.hora_entrada, r.hora_salida, 
                   CONCAT(s.nombre, ' ', s.apellido_paterno, ' ', s.apellido_materno) AS nombre_completo
            FROM registros_acceso r
            JOIN socios s ON r.socio_id = s.id
            ORDER BY r.fecha DESC, r.hora_entrada DESC";

    $resultado = $conexion->query($sql);

    if (!$resultado) {
        throw new Exception("Error en la consulta: " . $conexion->error);
    }

    $registros = [];
    while ($fila = $resultado->fetch_array(MYSQLI_ASSOC)) {
        $registros[] = $fila;
    }

    echo json_encode(['success' => true, 'data' => $registros]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} finally {
    $conexion->close();
}
