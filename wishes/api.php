<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$store = __DIR__ . DIRECTORY_SEPARATOR . 'messages.json';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function readMessages(string $store): array {
    if (!is_file($store)) return [];
    $decoded = json_decode((string) file_get_contents($store), true);
    return is_array($decoded) ? $decoded : [];
}

function respond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function textLength(string $value): int {
    if (function_exists('mb_strlen')) return mb_strlen($value, 'UTF-8');
    $count = preg_match_all('/./us', $value);
    return $count === false ? strlen($value) : $count;
}

if ($method === 'GET') {
    respond(200, ['messages' => readMessages($store)]);
}

if ($method !== 'POST') {
    header('Allow: GET, POST');
    respond(405, ['error' => 'Phương thức không được hỗ trợ.']);
}

$input = json_decode((string) file_get_contents('php://input'), true);
$name = trim((string) ($input['name'] ?? ''));
$wish = trim((string) ($input['wish'] ?? ''));
if ($name === '' || $wish === '' || textLength($name) > 80 || textLength($wish) > 1000) {
    respond(422, ['error' => 'Tên tối đa 80 ký tự và lời chúc tối đa 1000 ký tự.']);
}

$messages = readMessages($store);
$message = [
    'id' => bin2hex(random_bytes(8)),
    'name' => $name,
    'wish' => $wish,
    'createdAt' => gmdate(DATE_ATOM),
];
array_unshift($messages, $message);
$messages = array_slice($messages, 0, 500);
$json = json_encode($messages, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
if ($json === false || file_put_contents($store, $json . PHP_EOL, LOCK_EX) === false) {
    respond(500, ['error' => 'Không thể lưu lời chúc. Kiểm tra quyền ghi thư mục wishes.']);
}

respond(201, ['message' => $message]);
