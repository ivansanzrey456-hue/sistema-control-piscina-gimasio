<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'conexion.php';

$id = $_GET['id'] ?? null;

if (!$id || !is_numeric($id)) {
    die("<h2>ID no válido</h2>");
}

$sql = "SELECT * FROM socios WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows !== 1) {
    die("<h2>Socio no encontrado</h2>");
}

$socio = $resultado->fetch_assoc();

//registro de entradas y salidas
$mensajeRegistro = '';
$fechaHoy = date('Y-m-d');

// Validar si ya hizo entrada y salida hoy
$sqlDiaCompleto = "SELECT * FROM registros_acceso 
                   WHERE socio_id = ? AND fecha = ? AND hora_entrada IS NOT NULL AND hora_salida IS NOT NULL";
$stmtDiaCompleto = $conexion->prepare($sqlDiaCompleto);
$stmtDiaCompleto->bind_param("is", $id, $fechaHoy);
$stmtDiaCompleto->execute();
$resDiaCompleto = $stmtDiaCompleto->get_result();

if ($resDiaCompleto->num_rows > 0) {
    $mensajeRegistro = "⚠️ Ya se registró una entrada y salida hoy.";
} else {
    // Verificar si ya tiene una entrada sin salida hoy
    $sqlCheck = "SELECT * FROM registros_acceso 
                WHERE socio_id = ? AND fecha = ? AND hora_salida IS NULL 
                ORDER BY id DESC LIMIT 1";
    $stmtCheck = $conexion->prepare($sqlCheck);
    $stmtCheck->bind_param("is", $id, $fechaHoy);
    $stmtCheck->execute();
    $resCheck = $stmtCheck->get_result();

    if ($resCheck->num_rows === 0) {
        // Registrar nueva entrada
        $sqlInsert = "INSERT INTO registros_acceso (socio_id, fecha, hora_entrada) 
                      VALUES (?, ?, NOW())";
        $stmtInsert = $conexion->prepare($sqlInsert);
        $stmtInsert->bind_param("is", $id, $fechaHoy);
        $stmtInsert->execute();

        $hora = date('H:i');
        $mensajeRegistro = "✅ Entrada registrada a las $hora";
    } else {
        // Registrar salida
        $registro = $resCheck->fetch_assoc();
        $sqlUpdate = "UPDATE registros_acceso SET hora_salida = NOW() WHERE id = ?";
        $stmtUpdate = $conexion->prepare($sqlUpdate);
        $stmtUpdate->bind_param("i", $registro['id']);
        $stmtUpdate->execute();

        $hora = date('H:i');
        $mensajeRegistro = "🚪 Salida registrada a las $hora";
    }
}

// Comprobación de vigencia real
$hoy = new DateTime(); 
$fechaVencimiento = new DateTime($socio['fecha_vencimiento']);

$estado = '';
$colorEstado = 'gray';

if ($fechaVencimiento < $hoy) {
    $estado = 'Vencida';
    $colorEstado = 'red';


} else {
    $estado = 'Activa';
    $colorEstado = 'green';
}

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Validación de Socio</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background: #f0f4f8;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .credencial {
            background: white;
            border-radius: 10px;
            padding: 25px;
            max-width: 350px;
            width: 100%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            text-align: center;
        }
        .credencial img {
            width: 120px;
            height: 120px;
            object-fit: cover;
            border-radius: 50%;
            margin-bottom: 15px;
            border: 3px solid #007bff;
        }
        .credencial h2 {
            margin: 10px 0 5px;
            font-size: 20px;
            color: #333;
        }
        .credencial p {
            margin: 5px 0;
            font-size: 14px;
        }
        .estado {
            margin-top: 15px;
            padding: 10px;
            color: white;
            background-color: <?= $colorEstado ?>;
            border-radius: 8px;
            font-weight: bold;
        }
        .mensaje-registro {
        margin-top: 10px;
        padding: 10px;
        border-radius: 8px;
        font-weight: bold;
        color: white;
        }

        .mensaje-registro.azul {
        background-color: #3498db;
        }

        .mensaje-registro.amarillo {
        background-color: #f39c12;
        }

    </style>
</head>
<body>
    <div class="credencial">
        <p style="margin-top: 20px; color: #777;">Redirigiendo automáticamente al Dashboard en 5 segundos...</p>
        <img src="<?= $socio['foto_perfil'] ?>" alt="Foto del socio">
        <h2><?= htmlspecialchars($socio['nombre'] . ' ' . $socio['apellido_paterno'] . ' ' . $socio['apellido_materno']) ?></h2>
        <p><strong>Correo:</strong> <?= htmlspecialchars($socio['correo']) ?></p>
        <p><strong>Edad:</strong> <?= $socio['edad'] ?></p>
        <p><strong>ID Socio:</strong> <?= $socio['id'] ?></p>
        <p><strong>Registrado:</strong> <?= date('d/m/Y', strtotime($socio['fecha_registro'])) ?></p>
        <p><strong>Vence:</strong> <?= date('d/m/Y', strtotime($socio['fecha_vencimiento'])) ?></p>
        <div class="estado">
            <?= htmlspecialchars($estado) ?>
        </div>
        <?php if (!empty($mensajeRegistro)) : ?>
        <div class="mensaje-registro <?= strpos($mensajeRegistro, '⚠️') !== false ? 'amarillo' : 'azul' ?>">
            <?= htmlspecialchars($mensajeRegistro) ?>
        </div>
        <?php endif; ?>
    </div>
    <script>
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            window.location.replace("http://localhost:5173");
        }, 5000);
    });
    </script>

</body>
</html>
