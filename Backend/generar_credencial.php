<?php
// CORS: permitir solo cuando se haga la petición real (GET, POST)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require('libs/fpdf186/fpdf.php');
require('libs/phpqrcode/qrlib.php');
include 'conexion.php';

// Validar id
$id = $_GET['id'] ?? null;
if (!$id) {
    die("Falta el ID del socio");
}

$id = intval($id);
$sql = "SELECT * FROM socios WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    die("Socio no encontrado");
}

$socio = $result->fetch_assoc();
$nombreCompleto = $socio['nombre'] . ' ' . $socio['apellido_paterno'] . ' ' . $socio['apellido_materno'];
$edad = $socio['edad'];
$socioId = $socio['id'];
$fotoPath = $socio['foto_perfil'];

// Generar QR temporal
$tempDir = sys_get_temp_dir();
$qrFile = $tempDir . '/qr_' . uniqid() . '.png';

$host = $_SERVER['HTTP_HOST'];
$uri = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
$qrContenido = "http://$host$uri/validar_socio.php?id=" . urlencode($socioId);
QRcode::png($qrContenido, $qrFile, QR_ECLEVEL_L, 3);

// Crear PDF
$ancho = 85;
$alto = round($ancho * (990/630));
$pdf = new FPDF('P', 'mm', array($ancho, $alto));
$pdf->AddPage();
$pdf->SetMargins(0, 0, 0);

$plantilla = __DIR__ . '/plantilla/plantilla.png';
if (file_exists($plantilla)) {
    $pdf->Image($plantilla, 0, 0, $ancho, $alto);
}

if (file_exists($fotoPath)) {
    $pdf->Image($fotoPath, 27.5, 30, 30, 30);
} else {
    $pdf->SetFillColor(200, 200, 200);
    $pdf->Rect(27.5, 30, 30, 30, 'F');
    $pdf->SetFont('Arial', '', 8);
    $pdf->Text(30, 40, 'Sin foto');
}

$pdf->SetFont('Arial', '', 12);
$pdf->SetTextColor(0, 0, 0);
$pdf->SetXY(0, 75);
$pdf->Cell($ancho, 5, utf8_decode($nombreCompleto), 0, 1, 'C');
$pdf->Cell($ancho, 5, "Edad: $edad", 0, 1, 'C');
$pdf->Cell($ancho, 5, "ID: $socioId", 0, 1, 'C');

if (file_exists($qrFile)) {
    $pdf->Image($qrFile, 60, $alto - 25, 20, 20);
}

// IMPORTANTE: No mandes más headers después de esto
$pdf->Output('I', 'credencial_socio_' . $socioId . '.pdf');
unlink($qrFile);
exit(); // Asegura que no haya salida extra después
?>
