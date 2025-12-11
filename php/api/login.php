<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$conn = getDBConnection();

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = $_POST;
}

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit;
}

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

// Validation
if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit;
}

// Check user
$stmt = $conn->prepare("SELECT id, first_name, last_name, email, phone, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    exit;
}

// Set session
$_SESSION['user_id'] = $user['id'];
$_SESSION['first_name'] = $user['first_name'];
$_SESSION['last_name'] = $user['last_name'];
$_SESSION['email'] = $user['email'];

// Remove password from response
unset($user['password']);

echo json_encode([
    'success' => true, 
    'message' => 'Login successful!',
    'user' => $user
]);

$stmt->close();
$conn->close();
?>