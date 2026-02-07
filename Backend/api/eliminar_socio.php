<?php
header("Access-Control-Allow-Origin: *");
// Opcional: permite métodos personalizados (si usas POST, PUT, etc.)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
// Opcional: permite ciertos encabezados personalizados
header("Access-Control-Allow-Headers: Content-Type");

include '../conexion.php';

$id = $_POST['id'] ?? null;

if (!$id || !is_numeric($id)) {
    http_response_code(400);
    echo json_encode(['mensaje' => 'ID inválido']);
    exit;
}

$sql = "DELETE FROM socios WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(['mensaje' => 'Socio eliminado']);
