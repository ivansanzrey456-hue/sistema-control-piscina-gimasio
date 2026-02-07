<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include '../conexion.php';

$data = json_decode(file_get_contents('php://input'), true);

$socio_id = $data['socio_id'] ?? null;
$monto = $data['monto'] ?? null;
$metodo = $data['metodo'] ?? 'Efectivo';
$registrado_por = $data['registrado_por'] ?? 'admin';

if (!$socio_id || !$monto) {
    echo json_encode(["status" => "Error", "mensaje" => "Datos incompletos"]);
    exit;
}

$fecha_pago = date('Y-m-d');

// 1. Guardar el pago
$sqlPago = "INSERT INTO pagos_membresia (socio_id, monto, fecha_pago, metodo_pago, registrado_por)
            VALUES (?, ?, ?, ?, ?)";
$stmt = $conexion->prepare($sqlPago);
$stmt->bind_param("idsss", $socio_id, $monto, $fecha_pago, $metodo, $registrado_por);
$stmt->execute();

// 2. Reactivar la membresía y extender fecha
$nuevaFecha = (new DateTime())->modify('+1 month')->format('Y-m-d');
$sqlSocio = "UPDATE socios SET membresia_activa = 1, fecha_vencimiento = ? WHERE id = ?";
$stmt2 = $conexion->prepare($sqlSocio);
$stmt2->bind_param("si", $nuevaFecha, $socio_id);
$stmt2->execute();

echo json_encode(["status" => "Éxito"]);
?>
