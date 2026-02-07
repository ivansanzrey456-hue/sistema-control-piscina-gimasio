<?php
header("Access-Control-Allow-Origin: *");
// Opcional: permite métodos personalizados (si usas POST, PUT, etc.)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
// Opcional: permite ciertos encabezados personalizados
header("Access-Control-Allow-Headers: Content-Type");

include '../conexion.php';

$id = $_POST['id'] ?? null;
$estado = $_POST['estado'] ?? null;

if (!$id || !is_numeric($id)) {
    http_response_code(400);
    echo json_encode(["error" => "ID no válido"]);
    exit;
}

if (!isset($estado)) {
    http_response_code(400);
    echo json_encode(["error" => "Estado no proporcionado"]);
    exit;
}

$id = intval($id);
$estado = intval($estado);

if ($estado === 1) {
    // Reactivar: actualizar estado y extender vencimiento
    $nuevaFecha = (new DateTime())->modify('+1 month')->format('Y-m-d');
    $sql = "UPDATE socios SET membresia_activa = 1, fecha_vencimiento = ? WHERE id = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('si', $nuevaFecha, $id);
} else {
    // Suspender: solo cambiar estado
    $sql = "UPDATE socios SET membresia_activa = 0 WHERE id = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('i', $id);
}

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Error al actualizar"]);
}
?>