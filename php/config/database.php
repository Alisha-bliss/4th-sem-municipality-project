<?php
// Database configuration for XAMPP
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'nepal_gov_db');

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Create connection function
function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $conn->set_charset("utf8mb4");
    return $conn;
}

// Start session
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>