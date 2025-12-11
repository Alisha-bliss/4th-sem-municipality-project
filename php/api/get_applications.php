<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../config/database.php';

// Start session
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$conn = getDBConnection();
$userId = $_SESSION['user_id'];

// Get applications
$stmt = $conn->prepare("
    SELECT 
        application_number,
        service_type,
        status,
        DATE(created_at) as created_date,
        created_at
    FROM applications 
    WHERE user_id = ? 
    ORDER BY created_at DESC
    LIMIT 10
");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$applications = [];
while ($row = $result->fetch_assoc()) {
    $applications[] = $row;
}

// Get counts
$countStmt = $conn->prepare("
    SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved
    FROM applications 
    WHERE user_id = ?
");
$countStmt->bind_param("i", $userId);
$countStmt->execute();
$countResult = $countStmt->get_result()->fetch_assoc();

echo json_encode([
    'applications' => $applications,
    'counts' => $countResult
]);

$stmt->close();
$countStmt->close();
$conn->close();
?>