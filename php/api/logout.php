<?php
header('Content-Type: application/json');

// Destroy session
session_start();
session_unset();
session_destroy();

echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>