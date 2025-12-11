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

// Required fields
$requiredFields = ['first_name', 'last_name', 'email', 'phone', 'address', 'dob', 'citizenship_no', 'service_type'];
foreach ($requiredFields as $field) {
    if (empty($data[$field] ?? '')) {
        echo json_encode(['success' => false, 'message' => "Field '$field' is required"]);
        exit;
    }
}

// Start session to get user_id
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

$userId = $_SESSION['user_id'] ?? null;

// Prepare service data (extra fields)
$serviceData = [];
foreach ($data as $key => $value) {
    if (!in_array($key, $requiredFields) && $key !== 'middle_name') {
        $serviceData[$key] = $value;
    }
}

// Insert application
$stmt = $conn->prepare("
    INSERT INTO applications 
    (user_id, service_type, first_name, middle_name, last_name, email, phone, address, dob, citizenship_no, service_data) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$serviceDataJson = !empty($serviceData) ? json_encode($serviceData) : null;
$stmt->bind_param(
    "issssssssss", 
    $userId,
    $data['service_type'],
    $data['first_name'],
    $data['middle_name'] ?? null,
    $data['last_name'],
    $data['email'],
    $data['phone'],
    $data['address'],
    $data['dob'],
    $data['citizenship_no'],
    $serviceDataJson
);

if ($stmt->execute()) {
    $applicationId = $stmt->insert_id;
    $applicationNumber = 'APP-' . date('Ymd') . '-' . str_pad($applicationId, 6, '0', STR_PAD_LEFT);
    
    // Update with application number
    $updateStmt = $conn->prepare("UPDATE applications SET application_number = ? WHERE id = ?");
    $updateStmt->bind_param("si", $applicationNumber, $applicationId);
    $updateStmt->execute();
    $updateStmt->close();
    
    echo json_encode([
        'success' => true, 
        'message' => 'Application submitted successfully!',
        'application_number' => $applicationNumber,
        'application_id' => $applicationId
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to submit application: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>