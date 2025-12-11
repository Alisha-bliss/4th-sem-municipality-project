<?php
// Start session
session_start();

// Redirect if not logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: portal.html');
    exit;
}

// Database connection
$conn = new mysqli('localhost', 'root', '', 'nepal_gov_db');

// Get user info
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

// Get applications
$appStmt = $conn->prepare("SELECT * FROM applications WHERE user_id = ? ORDER BY created_at DESC");
$appStmt->bind_param("i", $_SESSION['user_id']);
$appStmt->execute();
$applications = $appStmt->get_result();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Nepal Government Services</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .dashboard {
            padding: 60px 0;
            min-height: 70vh;
        }
        .dashboard-header {
            margin-bottom: 40px;
        }
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        .dashboard-card {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .dashboard-card h3 {
            color: var(--primary);
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--accent);
        }
        .profile-info p {
            margin-bottom: 10px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }
        .stat-item {
            text-align: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: var(--primary);
        }
        .applications-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .applications-table th {
            background: var(--primary);
            color: white;
            padding: 15px;
            text-align: left;
        }
        .applications-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
        }
        .status-badge {
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .status-pending {
            background: #ffc107;
            color: #000;
        }
        .status-approved {
            background: #28a745;
            color: white;
        }
        .status-processing {
            background: #17a2b8;
            color: white;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container">
            <div class="header-top">
                <div class="logo">
                    <a href="portal.html" style="text-decoration: none; color: white; display: flex; align-items: center;">
                        <img src="logo.png" alt="Government Logo" onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPKWcJiRv_WPNc4zR1hNR7JVL42tQIHycOhg&s'">
                        <div class="logo-text">
                            <h1>Nepal Government Services</h1>
                            <p>सबैको साझा, सबैको विकास</p>
                        </div>
                    </a>
                </div>
                <div class="header-actions">
                    <div class="user-dropdown">
                        <button class="btn btn-user" id="userMenuBtn">
                            <i class="fas fa-user-circle"></i>
                            <?php echo htmlspecialchars($user['first_name']); ?>
                        </button>
                        <div class="dropdown-menu" id="userDropdown">
                            <a href="dashboard.php"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                            <a href="portal.html"><i class="fas fa-home"></i> Home</a>
                            <a href="apply.html"><i class="fas fa-file-alt"></i> New Application</a>
                            <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <nav>
            <div class="container">
                <ul class="nav-menu">
                    <li><a href="portal.html">Home</a></li>
                    <li><a href="portal.html#services">Services</a></li>
                    <li><a href="apply.html">Apply Now</a></li>
                    <li><a href="news.html">News & Updates</a></li>
                    <li><a href="dashboard.php" class="active">Dashboard</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <section class="dashboard">
        <div class="container">
            <div class="dashboard-header">
                <h2>Welcome, <?php echo htmlspecialchars($user['first_name'] . ' ' . $user['last_name']); ?>!</h2>
                <p>Manage your applications and profile information</p>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <h3><i class="fas fa-user-circle"></i> Profile Information</h3>
                    <div class="profile-info">
                        <p><strong>Full Name:</strong> <?php echo htmlspecialchars($user['first_name'] . ' ' . $user['last_name']); ?></p>
                        <p><strong>Email:</strong> <?php echo htmlspecialchars($user['email']); ?></p>
                        <p><strong>Phone:</strong> <?php echo htmlspecialchars($user['phone']); ?></p>
                        <p><strong>Member Since:</strong> <?php echo date('F j, Y', strtotime($user['created_at'])); ?></p>
                    </div>
                </div>

                <div class="dashboard-card">
                    <h3><i class="fas fa-chart-bar"></i> Application Statistics</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-number"><?php echo $applications->num_rows; ?></div>
                            <div class="stat-label">Total</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">
                                <?php 
                                    $pending = 0;
                                    $applications->data_seek(0);
                                    while($app = $applications->fetch_assoc()) {
                                        if($app['status'] == 'pending') $pending++;
                                    }
                                    echo $pending;
                                ?>
                            </div>
                            <div class="stat-label">Pending</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">
                                <?php 
                                    $approved = 0;
                                    $applications->data_seek(0);
                                    while($app = $applications->fetch_assoc()) {
                                        if($app['status'] == 'approved') $approved++;
                                    }
                                    echo $approved;
                                ?>
                            </div>
                            <div class="stat-label">Approved</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dashboard-card">
                <h3><i class="fas fa-file-alt"></i> Your Applications</h3>
                <?php if($applications->num_rows > 0): ?>
                    <table class="applications-table">
                        <thead>
                            <tr>
                                <th>Application No.</th>
                                <th>Service Type</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php 
                            $applications->data_seek(0);
                            while($app = $applications->fetch_assoc()): 
                            ?>
                            <tr>
                                <td><?php echo $app['application_number'] ?? 'N/A'; ?></td>
                                <td><?php echo ucfirst($app['service_type']); ?></td>
                                <td><?php echo date('M j, Y', strtotime($app['created_at'])); ?></td>
                                <td>
                                    <span class="status-badge status-<?php echo $app['status']; ?>">
                                        <?php echo ucfirst($app['status']); ?>
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-small" onclick="viewApplication(<?php echo $app['id']; ?>)">
                                        View
                                    </button>
                                </td>
                            </tr>
                            <?php endwhile; ?>
                        </tbody>
                    </table>
                <?php else: ?>
                    <p>No applications submitted yet. <a href="apply.html" class="btn btn-service">Apply for a service</a></p>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-column">
                    <h3>Contact Us</h3>
                    <ul class="footer-links">
                        <li><i class="fas fa-map-marker-alt"></i> Sanepa, Lalitpur, Nepal</li>
                        <li><i class="fas fa-phone"></i> +977-1-5211000</li>
                        <li><i class="fas fa-envelope"></i> info@gov.np</li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>Quick Links</h3>
                    <ul class="footer-links">
                        <li><a href="portal.html">Home</a></li>
                        <li><a href="portal.html#services">Services</a></li>
                        <li><a href="apply.html">Apply Now</a></li>
                        <li><a href="news.html">News & Updates</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>Important Links</h3>
                    <ul class="footer-links">
                        <li><a href="#">Office of the Prime Minister</a></li>
                        <li><a href="#">Ministry of Home Affairs</a></li>
                        <li><a href="#">Department of Immigration</a></li>
                        <li><a href="#">National ID Card</a></li>
                    </ul>
                </div>
            </div>
            <div class="copyright">
                <p>&copy; 2025 Government of Nepal. All Rights Reserved.</p>
            </div>
        </div>
    </footer>

    <script src="scripts/auth.js"></script>
    <script>
        // Add dropdown functionality
        document.getElementById('userMenuBtn').addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById('userDropdown').classList.toggle('show');
        });

        document.addEventListener('click', function() {
            document.getElementById('userDropdown').classList.remove('show');
        });

        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', async function(e) {
            e.preventDefault();
            try {
                const response = await fetch('php/api/logout.php');
                const data = await response.json();
                if (data.success) {
                    window.location.href = 'portal.html';
                }
            } catch (error) {
                console.error('Logout failed:', error);
            }
        });

        function viewApplication(appId) {
            alert('Application ID: ' + appId + '\nDetailed view will be implemented.');
        }
    </script>
</body>
</html>