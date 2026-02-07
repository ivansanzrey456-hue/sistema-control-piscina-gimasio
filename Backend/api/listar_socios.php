<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include '../conexion.php';

$nombre = $_GET['nombre'] ?? '';
$estado = $_GET['estado'] ?? '';
$fecha = $_GET['fecha'] ?? '';

$sql = "SELECT * FROM socios WHERE 1=1";

if (!empty($nombre)) {
    $sql .= " AND CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno) LIKE ?";
    $nombre = "%" . $nombre . "%";
}
if ($estado === 'activo') {
    $sql .= " AND membresia_activa = 1";
} elseif ($estado === 'vencido') {
    $sql .= " AND membresia_activa = 0";
}
if (!empty($fecha)) {
    $sql .= " AND DATE(fecha_registro) = ?";
}

$stmt = $conexion->prepare($sql);

$types = '';
$params = [];

if (!empty($nombre)) {
    $types .= 's';
    $params[] = &$nombre;
}
if (!empty($fecha)) {
    $types .= 's';
    $params[] = &$fecha;
}

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$socios = [];
while ($row = $result->fetch_assoc()) {
    $row['foto_perfil'] = 'http://localhost/edpointsPHP/' . $row['foto_perfil'];
    $socios[] = $row;
}

// 🔁 Validación automática de vencimiento (ya con socios cargados)
foreach ($socios as &$socio) {
    if (new DateTime($socio['fecha_vencimiento']) < new DateTime()) {
        $socio['membresia_activa'] = 0;

        // 📝 Opcional: sincroniza con la BD
        $conexion->query("UPDATE socios SET membresia_activa = 0 WHERE id = " . intval($socio['id']));
    }
}

header('Content-Type: application/json');
echo json_encode($socios);
?>
