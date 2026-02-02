<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$dataFile = __DIR__ . '/data/library.json';
$seedFile = __DIR__ . '/data/repos.seed.json';

// Crear directorio si no existe
if (!file_exists(dirname($dataFile))) {
    mkdir(dirname($dataFile), 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Leer datos
    if (file_exists($dataFile)) {
        echo file_get_contents($dataFile);
    } else {
        // Si no existe, cargar seed y crear archivo
        if (file_exists($seedFile)) {
            $seed = json_decode(file_get_contents($seedFile), true);
            $seed['version'] = 1;
            $json = json_encode($seed, JSON_PRETTY_PRINT);
            file_put_contents($dataFile, $json);
            echo $json;
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Seed file not found']);
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Guardar datos
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data !== null) {
        $json = json_encode($data, JSON_PRETTY_PRINT);
        file_put_contents($dataFile, $json);
        echo json_encode(['success' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
    }
}
