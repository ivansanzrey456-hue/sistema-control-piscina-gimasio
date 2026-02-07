<?php
// Encabezados CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit(0);
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'conexion.php';

$accion = $_GET['accion'] ?? null;

// Registro de Trabajador
if ($accion === 'registro') {
    if (
        isset($_POST['nombre'], $_POST['apellido_paterno'], $_POST['apellido_materno'], $_POST['correo'], $_POST['password'], $_POST['rol'], $_POST['estatus'])
    ) {
        // Validaciones
        function soloLetrasEspacios($texto) {
            return preg_match("/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/", $texto);
        }

        $nombre = trim($_POST['nombre']);
        $apellidoPaterno = trim($_POST['apellido_paterno']);
        $apellidoMaterno = trim($_POST['apellido_materno']);
        $correo = trim($_POST['correo']);
        $passwordRaw = $_POST['password'];
        $rol = trim($_POST['rol']);
        $estatus = trim($_POST['estatus']);
        $telefono = $_POST['telefono'] ?? '';
        $fecha_ingreso = date('Y-m-d');

        // ❌ Validar solo letras
        if (!soloLetrasEspacios($nombre) || !soloLetrasEspacios($apellidoPaterno) || !soloLetrasEspacios($apellidoMaterno)) {
            echo json_encode(['status' => 'Error', 'mensaje' => 'Nombre y apellidos solo deben contener letras y espacios']);
            exit;
        }

        // ❌ Validar correo
        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['status' => 'Error', 'mensaje' => 'Correo electrónico no válido']);
            exit;
        }

        // ❌ Verificar si el correo ya existe
        $sqlCorreo = "SELECT id FROM usuarios WHERE correo = '$correo'";
        $resCorreo = $conexion->query($sqlCorreo);
        if ($resCorreo && $resCorreo->num_rows > 0) {
            echo json_encode(['status' => 'Error', 'mensaje' => 'El correo ya está registrado']);
            exit;
        }

        // ❌ Validar longitud de contraseña
        if (strlen($passwordRaw) < 6) {
            echo json_encode(['status' => 'Error', 'mensaje' => 'La contraseña debe tener al menos 6 caracteres']);
            exit;
        }

        // ❌ Validar teléfono si se envía
        if (!empty($telefono) && !preg_match('/^\d{10}$/', $telefono)) {
            echo json_encode(['status' => 'Error', 'mensaje' => 'Teléfono inválido, deben ser 10 dígitos']);
            exit;
        }

        // ✅ Hashear la contraseña
        $password = password_hash($passwordRaw, PASSWORD_BCRYPT);

        // ✅ Subir imagen
        $fotoRuta = '';
        if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
            $extPermitidas = ['jpg', 'jpeg', 'png', 'gif'];
            if (!in_array(strtolower($ext), $extPermitidas)) {
                echo json_encode(['status' => 'Error', 'mensaje' => 'Formato de imagen no permitido']);
                exit;
            }

            $nombreFoto = uniqid('usuario_') . '.' . $ext;
            $rutaDestino = 'uploads_usuarios/' . $nombreFoto;

            if (!file_exists('uploads_usuarios')) {
                mkdir('uploads_usuarios', 0777, true);
            }

            move_uploaded_file($_FILES['foto']['tmp_name'], $rutaDestino);
            $fotoRuta = $rutaDestino;
        } else {
            echo json_encode(['status' => 'Error', 'mensaje' => 'Debe subir una foto válida']);
            exit;
        }

        // ✅ Insertar en BD
        $sql = "INSERT INTO usuarios 
                (nombre, apellido_paterno, apellido_materno, correo, password, telefono, fecha_ingreso, rol, estatus, foto_perfil)
                VALUES 
                ('$nombre', '$apellidoPaterno', '$apellidoMaterno', '$correo', '$password', '$telefono', '$fecha_ingreso', '$rol', '$estatus', '$fotoRuta')";

        if ($conexion->query($sql)) {
            echo json_encode(['status' => 'Éxito', 'mensaje' => 'Usuario registrado']);
        } else {
            echo json_encode(['status' => 'Error', 'mensaje' => 'Error al registrar usuario']);
        }
    } else {
        echo json_encode(['status' => 'Error', 'mensaje' => 'Faltan campos obligatorios']);
    }
}


// Registro de socio
elseif ($accion === 'registro_socio') {
    // Validaciones de campos
    if (
        empty($_POST['nombre']) ||
        empty($_POST['apellido_paterno']) ||
        empty($_POST['apellido_materno']) ||
        empty($_POST['correo']) ||
        empty($_POST['fecha_nacimiento'])
    ) {
        echo json_encode(['status' => 'Error', 'mensaje' => 'Todos los campos obligatorios deben ser completados']);
        exit;
    }

    if (!filter_var($_POST['correo'], FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'Error', 'mensaje' => 'Correo no válido']);
        exit;
    }

    if (!empty($_POST['telefono']) && !preg_match('/^\d{10}$/', $_POST['telefono'])) {
        echo json_encode(['status' => 'Error', 'mensaje' => 'Teléfono inválido, debe tener 10 dígitos']);
        exit;
    }

    if (!DateTime::createFromFormat('Y-m-d', $_POST['fecha_nacimiento'])) {
        echo json_encode(['status' => 'Error', 'mensaje' => 'Fecha de nacimiento inválida']);
        exit;
    }

    // Validar imagen
    if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['status' => 'Error', 'mensaje' => 'Foto obligatoria']);
        exit;
    }

    $extPermitidas = ['jpg', 'jpeg', 'png', 'gif'];
    $ext = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $extPermitidas)) {
        echo json_encode(['status' => 'Error', 'mensaje' => 'Solo se permiten imágenes JPG, PNG o GIF']);
        exit;
    }

    // Procesar datos
    $nombre = $conexion->real_escape_string($_POST['nombre']);
    $apellidoPaterno = $conexion->real_escape_string($_POST['apellido_paterno']);
    $apellidoMaterno = $conexion->real_escape_string($_POST['apellido_materno']);
    $correo = $conexion->real_escape_string($_POST['correo']);
    $telefono = $conexion->real_escape_string($_POST['telefono'] ?? '');
    $fechaNacimiento = $conexion->real_escape_string($_POST['fecha_nacimiento']);
    $fechaRegistro = date('Y-m-d');

    $nacimiento = new DateTime($fechaNacimiento);
    $edad = (new DateTime())->diff($nacimiento)->y;

    $fechaVencimiento = new DateTime($fechaRegistro);
    $fechaVencimiento->modify('+1 month');
    $fechaVencimientoStr = $fechaVencimiento->format('Y-m-d');

    // Subir imagen
    $nombreFoto = uniqid('foto_') . '.' . $ext;
    $rutaDestino = 'uploads/' . $nombreFoto;
    if (!file_exists('uploads')) {
        mkdir('uploads', 0777, true);
    }
    move_uploaded_file($_FILES['foto']['tmp_name'], $rutaDestino);
    $fotoRuta = $rutaDestino;

    // Guardar en BD
    $sql = "INSERT INTO socios (
                nombre, apellido_paterno, apellido_materno, correo, telefono,
                fecha_nacimiento, edad, fecha_registro, fecha_vencimiento,
                membresia_activa, foto_perfil
            ) VALUES (
                '$nombre', '$apellidoPaterno', '$apellidoMaterno', '$correo', '$telefono',
                '$fechaNacimiento', $edad, '$fechaRegistro', '$fechaVencimientoStr',
                1, '$fotoRuta'
            )";

    if ($conexion->query($sql)) {
    $nuevoId = $conexion->insert_id;
    echo json_encode([
        'status' => 'Éxito',
        'mensaje' => 'Socio registrado correctamente',
                'id' => $nuevoId
            ]);
        } else {
            echo json_encode(['status' => 'Error', 'mensaje' => 'Error al registrar socio']);
        }

}

// Login
elseif ($accion === 'login') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['correo'], $data['password'])) {
        $correo = $conexion->real_escape_string($data['correo']);
        $password = $data['password'];

        $sql = "SELECT * FROM usuarios WHERE correo = '$correo'";
        $result = $conexion->query($sql);

        if ($result->num_rows === 1) {
            $usuario = $result->fetch_assoc();
            if (password_verify($password, $usuario['password'])) {
                echo json_encode(['status' => 'Éxito', 'mensaje' => 'Login correcto', 'usuario' => ['nombre' => $usuario['nombre'], 'correo' => $usuario['correo']]]);
            } else {
                echo json_encode(['status' => 'Error', 'mensaje' => 'Contraseña incorrecta']);
            }
        } else {
            echo json_encode(['status' => 'Error', 'mensaje' => 'Usuario no encontrado']);
        }
    } else {
        echo json_encode(['status' => 'Error', 'mensaje' => 'Faltan datos']);
    }
}

$conexion->close();
