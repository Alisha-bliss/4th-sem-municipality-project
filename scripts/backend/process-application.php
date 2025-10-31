<?php
header('Content-Type: application/json');
require_once 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Basic personal information
    $firstName = trim($_POST['first_name']);
    $lastName = trim($_POST['last_name']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone']);
    $address = trim($_POST['address']);
    $dob = $_POST['dob'];
    $citizenshipNo = trim($_POST['citizenship_no']);
    $serviceType = $_POST['service_type'];
    
    // Service-specific fields
    $serviceData = [];
    
    // Collect service-specific data based on service type
    switch($serviceType) {
        case 'marriage':
            $serviceData = [
                'spouse_name' => $_POST['spouse_name'] ?? '',
                'spouse_citizenship' => $_POST['spouse_citizenship'] ?? '',
                'marriage_date' => $_POST['marriage_date'] ?? '',
                'marriage_district' => $_POST['marriage_district'] ?? '',
                'witness_name' => $_POST['witness_name'] ?? '',
                'relationship' => $_POST['relationship'] ?? ''
            ];
            break;
            
        case 'citizenship':
            $serviceData = [
                'birth_place' => $_POST['birth_place'] ?? '',
                'birth_district' => $_POST['birth_district'] ?? '',
                'father_name' => $_POST['father_name'] ?? '',
                'father_citizenship' => $_POST['father_citizenship'] ?? '',
                'mother_name' => $_POST['mother_name'] ?? '',
                'mother_citizenship' => $_POST['mother_citizenship'] ?? '',
                'grandfather_name' => $_POST['grandfather_name'] ?? '',
                'permanent_district' => $_POST['permanent_district'] ?? ''
            ];
            break;
            
        case 'death':
            $serviceData = [
                'deceased_name' => $_POST['deceased_name'] ?? '',
                'deceased_citizenship' => $_POST['deceased_citizenship'] ?? '',
                'death_date' => $_POST['death_date'] ?? '',
                'death_place' => $_POST['death_place'] ?? '',
                'death_cause' => $_POST['death_cause'] ?? '',
                'relationship' => $_POST['relationship'] ?? '',
                'death_details' => $_POST['death_details'] ?? ''
            ];
            break;
            
        case 'senior':
            $serviceData = [
                'age' => $_POST['age'] ?? '',
                'occupation' => $_POST['occupation'] ?? '',
                'monthly_income' => $_POST['monthly_income'] ?? '',
                'disability' => $_POST['disability'] ?? '',
                'disability_type' => $_POST['disability_type'] ?? '',
                'disability_cert_no' => $_POST['disability_cert_no'] ?? ''
            ];
            break;
            
        case 'migration':
            $serviceData = [
                'current_address' => $_POST['current_address'] ?? '',
                'new_address' => $_POST['new_address'] ?? '',
                'migration_date' => $_POST['migration_date'] ?? '',
                'migration_reason' => $_POST['migration_reason'] ?? '',
                'migration_details' => $_POST['migration_details'] ?? ''
            ];
            break;
    }
    
    // Validation
    $errors = [];
    
    if (empty($firstName) || empty($lastName) || empty($email) || empty($phone) || 
        empty($address) || empty($dob) || empty($citizenshipNo) || empty($serviceType)) {
        $errors[] = 'All required fields must be filled.';
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email format.';
    }
    
    // Validate service-specific required fields
    foreach($serviceData as $key => $value) {
        if (empty($value) && !in_array($key, ['witness_name', 'death_details', 'migration_details', 
            'disability_type', 'disability_cert_no', 'monthly_income'])) {
            $errors[] = "Please fill all required service-specific fields.";
            break;
        }
    }
    
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
        exit;
    }
    
    try {
        $pdo = initializeDatabaseTables();
        if (!$pdo) {
            throw new Exception('Database connection failed.');
        }
        
        // Insert application
        $stmt = $pdo->prepare("INSERT INTO service_applications 
            (service_type, first_name, last_name, email, phone, address, dob, citizenship_no, service_data, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')");
        
        $serviceDataJson = json_encode($serviceData);
        $stmt->execute([
            $serviceType, $firstName, $lastName, $email, $phone, $address, $dob, $citizenshipNo, $serviceDataJson
        ]);
        
        $applicationId = $pdo->lastInsertId();
        
        // Generate appointment date (3-7 days from now)
        $appointmentDate = date('Y-m-d', strtotime('+' . rand(3,7) . ' days'));
        
        // Send email notification
        $emailSent = sendApplicationConfirmation($email, $firstName . ' ' . $lastName, $serviceType, $applicationId, $appointmentDate);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Application submitted successfully! You will receive an email confirmation shortly.',
            'appointment_date' => $appointmentDate
        ]);
        
    } catch (Exception $e) {
        error_log("Application submission error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Database error. Please try again.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}

function sendApplicationConfirmation($to, $name, $serviceType, $applicationId, $appointmentDate) {
    $subject = "Application Confirmation - Nepal Government Services";
    
    $serviceNames = [
        'marriage' => 'Marriage Registration',
        'citizenship' => 'Citizenship Application', 
        'death' => 'Death Registration',
        'senior' => 'Senior Citizenship',
        'migration' => 'Migration Registration'
    ];
    
    $serviceName = $serviceNames[$serviceType] ?? $serviceType;
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .header { background: #1a4d8c; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .appointment { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h2>Nepal Government Services Portal</h2>
        </div>
        <div class='content'>
            <h3>Application Confirmation</h3>
            <p>Dear $name,</p>
            <p>Thank you for submitting your application for <strong>$serviceName</strong>.</p>
            
            <div class='appointment'>
                <h4>Appointment Details</h4>
                <p><strong>Application ID:</strong> $applicationId</p>
                <p><strong>Service Type:</strong> $serviceName</p>
                <p><strong>Appointment Date:</strong> $appointmentDate</p>
            </div>
            
            <p>Please visit your local ward office on the scheduled date with all required documents.</p>
            <p>If you have any questions, please contact us at info@gov.np or call +977-1-4211000.</p>
            
            <p>Best regards,<br>Nepal Government Services Team</p>
        </div>
    </body>
    </html>
    ";
    
    // For demo purposes, we'll just log the email
    error_log("Would send email to: $to - Subject: $subject");
    
    // In production, use PHPMailer or similar
    // mail($to, $subject, $message, [
    //     'From' => 'noreply@gov.np',
    //     'Content-Type' => 'text/html; charset=UTF-8'
    // ]);
    
    return true;
}
?>