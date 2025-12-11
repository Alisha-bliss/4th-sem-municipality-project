<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Start session
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'logged_in' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'first_name' => $_SESSION['first_name'] ?? '',
            'last_name' => $_SESSION['last_name'] ?? '',
            'email' => $_SESSION['email'] ?? ''
        ]
    ]);
} else {
    echo json_encode(['logged_in' => false]);
}
?>