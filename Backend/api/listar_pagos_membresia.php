<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../conexion.php';

$condiciones = [];

if (isset($_GET['fechaInicio']) && $_GET['fechaInicio'] !== '') {
    $condiciones[] = "pm.fecha_pago >= '" . $conexion->real_escape_string($_GET['fechaInicio']) . "'";
}
//if (isset($_GET['fechaFin']) && $_GET['fechaFin'] !== '') {
  //  $condiciones[] = "pm.fecha_pago <= '" . $conexion->real_escape_string($_GET['fechaFin']) . "'";
//}
if (isset($_GET['busqueda']) && $_GET['busqueda'] !== '') {
    $busqueda = '%' . $conexion->real_escape_string($_GET['busqueda']) . '%';
    $condiciones[] = "(s.nombre LIKE '$busqueda' OR s.apellido_paterno LIKE '$busqueda' OR s.id = '" . intval($_GET['busqueda']) . "')";
}
if (isset($_GET['metodo']) && $_GET['metodo'] !== '') {
    $condiciones[] = "pm.metodo_pago = '" . $conexion->real_escape_string($_GET['metodo']) . "'";
}

$where = count($condiciones) ? "WHERE " . implode(" AND ", $condiciones) : "";

$sql = "SELECT pm.id, 
               CONCAT(s.nombre, ' ', s.apellido_paterno, ' ', s.apellido_materno) AS nombre_completo, 
               pm.monto, pm.metodo_pago, pm.fecha_pago, pm.registrado_por
        FROM pagos_membresia pm
        JOIN socios s ON pm.socio_id = s.id
        $where
        ORDER BY pm.fecha_pago DESC";

$resultado = $conexion->query($sql);

if (!$resultado) {
    echo json_encode(["error" => "Error en la consulta: " . $conexion->error]);
    exit;
}

$pagos = [];
while ($fila = $resultado->fetch_assoc()) {
    $pagos[] = $fila;
}

echo json_encode($pagos);
?>
