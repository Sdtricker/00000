<?php
header('Content-Type: application/json');

// Basic rate limiting by IP (simple file-based, for demo)
$ip = $_SERVER['REMOTE_ADDR'];
$limit_file = sys_get_temp_dir() . "/froxty_rate_" . md5($ip);
$limit = 5; // max requests
$window = 60; // seconds

if (file_exists($limit_file)) {
    $data = json_decode(file_get_contents($limit_file), true);
    if ($data && $data['time'] > time() - $window) {
        if ($data['count'] >= $limit) {
            http_response_code(429);
            echo json_encode(['error' => 'Rate limit exceeded. Try again later.']);
            exit;
        }
        $data['count']++;
    } else {
        $data = ['count' => 1, 'time' => time()];
    }
} else {
    $data = ['count' => 1, 'time' => time()];
}
file_put_contents($limit_file, json_encode($data));

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$phone = isset($input['phone']) ? preg_replace('/\D/', '', $input['phone']) : '';
if (!$phone || strlen($phone) < 10 || strlen($phone) > 15) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid phone number']);
    exit;
}

$url = "https://glonova.in/hhhh.php/?ng=" . urlencode($phone);
$options = [
    'http' => [
        'method' => 'GET',
        'header' => [
            'User-Agent: DarkFroxty/1.0'
        ]
    ]
];
$context = stream_context_create($options);
$response = @file_get_contents($url, false, $context);
if ($response === false) {
    http_response_code(502);
    echo json_encode(['error' => 'Failed to fetch data from upstream API']);
    exit;
}

// Pass through the JSON response
header('Content-Type: application/json');
echo $response;