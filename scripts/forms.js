// Form submission handlers and dynamic form logic
document.addEventListener('DOMContentLoaded', function() {
    console.log('Forms initialized');
    
    // Initialize dynamic form functionality
    initializeDynamicForm();
    
    // Application form submission
    const serviceForm = document.getElementById('serviceForm');
    if (serviceForm) {
        console.log('Service form found');
        serviceForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Service form submitted');
            
            // Basic validation
            const serviceType = document.getElementById('serviceType');
            if (!serviceType || !serviceType.value) {
                showMessage('Please select a service type.', 'error');
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('.btn-submit');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                submitBtn.disabled = true;

                try {
                    // Get form data
                    const formData = new FormData(this);
                    const data = {};
                    for (let [key, value] of formData.entries()) {
                        data[key] = value;
                    }
                    
                    console.log('Form data:', data);
                    
                    // Submit to PHP API
                    const response = await fetch('php/api/submit_application.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        const serviceName = serviceType.options[serviceType.selectedIndex].text;
                        const message = `Thank you! Your ${serviceName} application has been submitted successfully. 
                                       Application Number: <strong>${result.application_number}</strong>`;
                        showMessage(message, 'success');
                        
                        // Reset form
                        this.reset();
                        
                        // Reset dynamic fields
                        const extraFields = document.getElementById('extraFields');
                        const serviceDescription = document.getElementById('serviceDescription');
                        if (extraFields) {
                            extraFields.innerHTML = `
                                <div class="extra-fields-placeholder">
                                    <i class="fas fa-arrow-down"></i>
                                    <p>Additional service-specific fields will appear here after selecting a service</p>
                                </div>
                            `;
                        }
                        if (serviceDescription) {
                            serviceDescription.innerHTML = `
                                <div class="service-info-icon">
                                    <i class="fas fa-info-circle"></i>
                                </div>
                                <div class="service-info-content">
                                    <h4>Service Information</h4>
                                    <p>Please select a service to see specific requirements and additional information.</p>
                                </div>
                            `;
                        }
                    } else {
                        showMessage(result.message || 'Failed to submit application. Please try again.', 'error');
                    }
                } catch (error) {
                    console.error('Submission error:', error);
                    showMessage('An error occurred. Please try again.', 'error');
                } finally {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found');
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Login form submitted');
            
            const submitBtn = this.querySelector('.btn-submit');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Logging in...';
                submitBtn.disabled = true;

                try {
                    const email = document.getElementById('loginEmail').value;
                    const password = document.getElementById('loginPassword').value;
                    
                    const response = await fetch('php/api/login.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        showMessage('Login successful!', 'success');
                        
                        // Close modal after success
                        const loginModal = document.getElementById('loginModal');
                        if (loginModal) {
                            setTimeout(() => {
                                loginModal.style.display = 'none';
                                document.body.style.overflow = 'auto';
                                // Update UI and reload page
                                window.location.reload();
                            }, 1500);
                        }
                    } else {
                        showMessage(data.message || 'Login failed. Please try again.', 'error');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    showMessage('An error occurred. Please try again.', 'error');
                } finally {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }

    // Register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log('Register form found');
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Register form submitted');
            
            const password = document.getElementById('regPassword');
            const confirmPassword = document.getElementById('regConfirmPassword');
            
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                showMessage('Passwords do not match!', 'error');
                return;
            }
            
            const submitBtn = this.querySelector('.btn-submit');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Creating Account...';
                submitBtn.disabled = true;

                try {
                    const formData = new FormData(this);
                    const data = Object.fromEntries(formData.entries());
                    
                    const response = await fetch('php/api/register.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        showMessage(result.message || 'Account created successfully!', 'success');
                        
                        // Switch to login modal after success
                        const registerModal = document.getElementById('registerModal');
                        const loginModal = document.getElementById('loginModal');
                        if (registerModal && loginModal) {
                            setTimeout(() => {
                                registerModal.style.display = 'none';
                                loginModal.style.display = 'flex';
                                this.reset();
                                // Update UI and reload page
                                window.location.reload();
                            }, 2000);
                        }
                    } else {
                        showMessage(result.message || 'Registration failed. Please try again.', 'error');
                    }
                } catch (error) {
                    console.error('Registration error:', error);
                    showMessage('An error occurred. Please try again.', 'error');
                } finally {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
});

// Dynamic form functionality
function initializeDynamicForm() {
    console.log('Initializing dynamic form');
    const serviceType = document.getElementById('serviceType');
    if (serviceType) {
        serviceType.addEventListener('change', function() {
            console.log('Service type changed:', this.value);
            const extraFields = document.getElementById('extraFields');
            const serviceDescription = document.getElementById('serviceDescription');
            
            // Clear previous content
            if (extraFields) {
                extraFields.innerHTML = '';
            }
            
            // Service descriptions
            const descriptions = {
                'marriage': {
                    icon: 'fa-heart',
                    title: 'Marriage Registration',
                    description: 'Register your marriage officially with the government of Nepal.',
                    requirements: 'Required documents: Citizenship certificate, photos, marriage evidence, witness details.'
                },
                'citizenship': {
                    icon: 'fa-id-card',
                    title: 'Citizenship Application',
                    description: 'Apply for Nepali citizenship certificate through online process.',
                    requirements: 'Required documents: Birth certificate, parents citizenship, photos, family details.'
                },
                'death': {
                    icon: 'fa-file-certificate',
                    title: 'Death Registration',
                    description: 'Register death of a family member for official records.',
                    requirements: 'Required documents: Death certificate, applicant citizenship, deceased details.'
                },
                'senior': {
                    icon: 'fa-user-friends',
                    title: 'Senior Citizenship',
                    description: 'Apply for senior citizenship and avail special benefits.',
                    requirements: 'Required documents: Citizenship, age proof, photos, income details.'
                },
                'migration': {
                    icon: 'fa-passport',
                    title: 'Migration Registration',
                    description: 'Register your migration to another location within Nepal.',
                    requirements: 'Required documents: Citizenship, proof of addresses, migration reason.'
                }
            };
            
            // Update service description
            if (this.value && descriptions[this.value] && serviceDescription) {
                const desc = descriptions[this.value];
                serviceDescription.innerHTML = `
                    <div class="service-info-icon">
                        <i class="fas ${desc.icon}"></i>
                    </div>
                    <div class="service-info-content">
                        <h4>${desc.title}</h4>
                        <p><strong>Description:</strong> ${desc.description}</p>
                        <p><strong>Requirements:</strong> ${desc.requirements}</p>
                    </div>
                `;
            } else if (serviceDescription) {
                serviceDescription.innerHTML = `
                    <div class="service-info-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="service-info-content">
                        <h4>Service Information</h4>
                        <p>Please select a service to see specific requirements and additional information.</p>
                    </div>
                `;
            }
            
            // Generate dynamic fields based on selected service
            if (this.value && extraFields) {
                if (this.value === 'marriage') {
                    extraFields.innerHTML = `
                        <h3>Marriage Registration Details</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="required">Spouse Full Name</label>
                                <input type="text" class="form-control" name="spouse_name" required>
                            </div>
                            <div class="form-group">
                                <label class="required">Spouse Citizenship Number</label>
                                <input type="text" class="form-control" name="spouse_citizenship" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="required">Date of Marriage</label>
                                <input type="date" class="form-control" name="marriage_date" required>
                            </div>
                            <div class="form-group">
                                <label class="required">Marriage District</label>
                                <input type="text" class="form-control" name="marriage_district" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Witness Name (Optional)</label>
                            <input type="text" class="form-control" name="witness_name">
                        </div>
                        <div class="form-group">
                            <label class="required">Relationship with Applicant</label>
                            <select class="form-control" name="relationship" required>
                                <option value="">-- Select relationship --</option>
                                <option value="groom">Groom</option>
                                <option value="bride">Bride</option>
                            </select>
                        </div>
                    `;
                } 
                else if (this.value === 'citizenship') {
                    extraFields.innerHTML = `
                        <h3>Citizenship Application Details</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="required">Place of Birth</label>
                                <input type="text" class="form-control" name="birth_place" required>
                            </div>
                            <div class="form-group">
                                <label class="required">District of Birth</label>
                                <input type="text" class="form-control" name="birth_district" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="required">Father's Name</label>
                                <input type="text" class="form-control" name="father_name" required>
                            </div>
                            <div class="form-group">
                                <label class="required">Father's Citizenship No.</label>
                                <input type="text" class="form-control" name="father_citizenship" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="required">Mother's Name</label>
                                <input type="text" class="form-control" name="mother_name" required>
                            </div>
                            <div class="form-group">
                                <label class="required">Mother's Citizenship No.</label>
                                <input type="text" class="form-control" name="mother_citizenship" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="required">Grandfather's Name</label>
                            <input type="text" class="form-control" name="grandfather_name" required>
                        </div>
                        <div class="form-group">
                            <label class="required">Permanent Address District</label>
                            <input type="text" class="form-control" name="permanent_district" required>
                        </div>
                    `;
                }
                else if (this.value === 'death') {
                    extraFields.innerHTML = `
                        <h3>Death Registration Details</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="required">Deceased Full Name</label>
                                <input type="text" class="form-control" name="deceased_name" required>
                            </div>
                            <div class="form-group">
                                <label class="required">Deceased Citizenship No.</label>
                                <input type="text" class="form-control" name="deceased_citizenship" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="required">Date of Death</label>
                                <input type="date" class="form-control" name="death_date" required>
                            </div>
                            <div class="form-group">
                                <label class="required">Place of Death</label>
                                <input type="text" class="form-control" name="death_place" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="required">Cause of Death</label>
                            <select class="form-control" name="death_cause" required>
                                <option value="">-- Select cause --</option>
                                <option value="natural">Natural Causes</option>
                                <option value="accident">Accident</option>
                                <option value="illness">Illness</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="required">Relationship with Deceased</label>
                            <input type="text" class="form-control" name="relationship" required>
                        </div>
                        <div class="form-group">
                            <label>Additional Details (if any)</label>
                            <textarea class="form-control" name="death_details" rows="3"></textarea>
                        </div>
                    `;
                }
                else if (this.value === 'senior') {
                    extraFields.innerHTML = `
                        <h3>Senior Citizenship Details</h3>
                        <div class="form-group">
                            <label class="required">Age</label>
                            <input type="number" class="form-control" name="age" min="60" required>
                        </div>
                        <div class="form-group">
                            <label class="required">Current Occupation</label>
                            <input type="text" class="form-control" name="occupation" required>
                        </div>
                        <div class="form-group">
                            <label class="required">Monthly Income (if any)</label>
                            <input type="number" class="form-control" name="monthly_income" min="0">
                        </div>
                        <div class="form-group">
                            <label class="required">Do you have any disabilities?</label>
                            <select class="form-control" name="disability" id="disabilitySelect" required>
                                <option value="">-- Select --</option>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                        <div id="disabilityDetails" class="conditional-field" style="display: none;">
                            <div class="form-group">
                                <label class="required">Disability Type</label>
                                <input type="text" class="form-control" name="disability_type">
                            </div>
                            <div class="form-group">
                                <label>Disability Certificate No.</label>
                                <input type="text" class="form-control" name="disability_cert_no">
                            </div>
                        </div>
                    `;
                    
                    // Add event listener for disability selection
                    setTimeout(() => {
                        const disabilitySelect = document.getElementById('disabilitySelect');
                        if (disabilitySelect) {
                            disabilitySelect.addEventListener('change', function() {
                                const disabilityDetails = document.getElementById('disabilityDetails');
                                if (disabilityDetails) {
                                    disabilityDetails.style.display = this.value === 'yes' ? 'block' : 'none';
                                }
                            });
                        }
                    }, 100);
                }
                else if (this.value === 'migration') {
                    extraFields.innerHTML = `
                        <h3>Migration Registration Details</h3>
                        <div class="form-group">
                            <label class="required">Current Address (From)</label>
                            <textarea class="form-control" name="current_address" rows="2" required></textarea>
                        </div>
                        <div class="form-group">
                            <label class="required">New Address (To)</label>
                            <textarea class="form-control" name="new_address" rows="2" required></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="required">Migration Date</label>
                                <input type="date" class="form-control" name="migration_date" required>
                            </div>
                            <div class="form-group">
                                <label class="required">Reason for Migration</label>
                                <select class="form-control" name="migration_reason" required>
                                    <option value="">-- Select reason --</option>
                                    <option value="employment">Employment</option>
                                    <option value="education">Education</option>
                                    <option value="family">Family</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Additional Information</label>
                            <textarea class="form-control" name="migration_details" rows="3"></textarea>
                        </div>
                    `;
                }
            }
        });
    }
}