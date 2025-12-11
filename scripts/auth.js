// Authentication functions

// Check if user is logged in
async function checkAuthStatus() {
    try {
        const response = await fetch('php/api/check_auth.php');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Auth check failed:', error);
        return { logged_in: false };
    }
}

// Update UI based on login status
async function updateAuthUI() {
    const authStatus = await checkAuthStatus();
    const headerActions = document.querySelector('.header-actions');
    
    if (!headerActions) return;
    
    if (authStatus.logged_in && authStatus.user) {
        // User is logged in - show user menu
        headerActions.innerHTML = `
            <div class="user-dropdown">
                <button class="btn btn-user" id="userMenuBtn">
                    <i class="fas fa-user-circle"></i>
                    ${authStatus.user.first_name}
                </button>
                <div class="dropdown-menu" id="userDropdown">
                    <a href="dashboard.php"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                    <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>
        `;
        
        // Add dropdown functionality
        setTimeout(() => {
            const userMenuBtn = document.getElementById('userMenuBtn');
            const userDropdown = document.getElementById('userDropdown');
            const logoutBtn = document.getElementById('logoutBtn');
            
            if (userMenuBtn && userDropdown) {
                userMenuBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    userDropdown.classList.toggle('show');
                });
                
                document.addEventListener('click', function() {
                    userDropdown.classList.remove('show');
                });
            }
            
            if (logoutBtn) {
                logoutBtn.addEventListener('click', async function(e) {
                    e.preventDefault();
                    await logoutUser();
                });
            }
        }, 100);
    } else {
        // User is not logged in - show login/register buttons
        if (!headerActions.querySelector('.btn-login')) {
            headerActions.innerHTML = `
                <button class="btn btn-login" id="loginBtn">Login</button>
                <button class="btn btn-register" id="registerBtn">Register</button>
            `;
            
            // Re-attach modal listeners
            setTimeout(() => {
                attachModalListeners();
            }, 100);
        }
    }
}

// Logout function
async function logoutUser() {
    try {
        const response = await fetch('php/api/logout.php');
        const data = await response.json();
        
        if (data.success) {
            // Reload page to update UI
            window.location.reload();
        }
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

// Function to show messages
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 9999;
        color: white;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = '#28a745';
    } else if (type === 'error') {
        messageDiv.style.background = '#dc3545';
    } else {
        messageDiv.style.background = '#17a2b8';
    }
    
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
});