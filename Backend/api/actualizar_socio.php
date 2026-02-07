<?php
// api/actualizar_socio.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
include '../conexion.php';
date_default_timezone_set('America/Mexico_City');

// Modo 1: JSON simple (sin nueva foto)
if (strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        echo json_encode(["status" => "Error", "mensaje" => "JSON inválido"]);
        exit;
    }

    $campos = ['id', 'nombre', 'apellido_paterno', 'apellido_materno', 'correo', 'telefono', 'edad', 'foto_perfil'];
    foreach ($campos as $campo) {
        if (empty($data[$campo])) {
            echo json_encode(["status" => "Error", "mensaje" => "Falta el campo: $campo"]);
            exit;
        }
    }

    $id = intval($data['id']);
    $nombre = trim($data['nombre']);
    $apellido_paterno = trim($data['apellido_paterno']);
    $apellido_materno = trim($data['apellido_materno']);
    $correo = trim($data['correo']);
    $telefono = trim($data['telefono']);
    $edad = intval($data['edad']);
    $foto_perfil = trim($data['foto_perfil']);
} 
// Modo 2: FormData (con archivo nuevo)
else {
    if (
        !isset($_POST['id'], $_POST['nombre'], $_POST['apellido_paterno'], $_POST['apellido_materno'],
                $_POST['correo'], $_POST['telefono'], $_POST['edad'])
    ) {
        echo json_encode(["status" => "Error", "mensaje" => "Faltan campos en el formulario"]);
        exit;
    }

    $id = intval($_POST['id']);
    $nombre = trim($_POST['nombre']);
    $apellido_paterno = trim($_POST['apellido_paterno']);
    $apellido_materno = trim($_POST['apellido_materno']);
    $correo = trim($_POST['correo']);
    $telefono = trim($_POST['telefono']);
    $edad = intval($_POST['edad']);

    // Procesar nueva foto si se envía
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === 0) {
        $nombreFoto = "foto_" . uniqid() . ".jpeg";
        $rutaDestino = "../uploads/" . $nombreFoto;

        if (move_uploaded_file($_FILES['foto']['tmp_name'], $rutaDestino)) {
           $foto_perfil = "uploads/" . $nombreFoto;
        } else {
            echo json_encode(["status" => "Error", "mensaje" => "Error al subir la foto"]);
            exit;
        }
    } else {
        // Si no se envía una nueva foto, mantenemos la actual
        $stmt = $conexion->prepare("SELECT foto_perfil FROM socios WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->bind_result($foto_perfil);
        $stmt->fetch();
        $stmt->close();
    }
}

// Ejecutar actualización
$query = "UPDATE socios SET 
    nombre = ?, 
    apellido_paterno = ?, 
    apellido_materno = ?, 
    correo = ?, 
    telefono = ?, 
    edad = ?, 
    foto_perfil = ?
    WHERE id = ?";

$stmt = $conexion->prepare($query);
$stmt->bind_param("sssssssi", $nombre, $apellido_paterno, $apellido_materno, $correo, $telefono, $edad, $foto_perfil, $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "Éxito", "mensaje" => "Socio actualizado correctamente"]);
} else {
    echo json_encode(["status" => "Error", "mensaje" => "Error al actualizar socio"]);
}

$stmt->close();
$conexion->close();
