// SafeJourney Bus Tours - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Registration form handling
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }

    // Inquiry form handling
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', handleInquiry);
    }

    // Set minimum date for travel date to today
    const travelDateInput = document.getElementById('travelDate');
    if (travelDateInput) {
        const today = new Date().toISOString().split('T')[0];
        travelDateInput.min = today;
    }
});

// Handle user registration
async function handleRegistration(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Convert FormData to JSON
    const data = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!validateRegistrationForm(data)) {
        return;
    }
    
    // Show loading state
    setButtonLoading(submitBtn, true);
    
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('success', 'Registration Successful!', result.message);
            form.reset();
        } else {
            showToast('error', 'Registration Failed', result.message);
        }
    } catch (error) {
        console.error('Registration error:', error);
        showToast('error', 'Registration Failed', 'Network error. Please try again.');
    } finally {
        setButtonLoading(submitBtn, false);
    }
}

// Handle inquiry submission
async function handleInquiry(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Convert FormData to JSON
    const data = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!validateInquiryForm(data)) {
        return;
    }
    
    // Show loading state
    setButtonLoading(submitBtn, true);
    
    try {
        const response = await fetch('/inquiry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('success', 'Inquiry Submitted!', result.message);
            form.reset();
        } else {
            showToast('error', 'Submission Failed', result.message);
        }
    } catch (error) {
        console.error('Inquiry error:', error);
        showToast('error', 'Submission Failed', 'Network error. Please try again.');
    } finally {
        setButtonLoading(submitBtn, false);
    }
}

// Validate registration form
function validateRegistrationForm(data) {
    const errors = [];
    
    if (!data.full_name || data.full_name.trim().length < 2) {
        errors.push('Full name must be at least 2 characters long');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.password || data.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    
    if (!data.phone_number || data.phone_number.trim().length < 10) {
        errors.push('Please enter a valid phone number');
    }
    
    if (errors.length > 0) {
        showToast('error', 'Validation Error', errors.join('<br>'));
        return false;
    }
    
    return true;
}

// Validate inquiry form
function validateInquiryForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.phone_number || data.phone_number.trim().length < 10) {
        errors.push('Please enter a valid phone number');
    }
    
    if (!data.pickup_location || data.pickup_location.trim().length < 2) {
        errors.push('Please enter a pickup location');
    }
    
    if (!data.drop_location || data.drop_location.trim().length < 2) {
        errors.push('Please enter a drop location');
    }
    
    if (!data.travel_date) {
        errors.push('Please select a travel date');
    } else {
        const selectedDate = new Date(data.travel_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            errors.push('Travel date cannot be in the past');
        }
    }
    
    if (!data.number_of_seats || parseInt(data.number_of_seats) < 1) {
        errors.push('Please select number of seats');
    }
    
    if (errors.length > 0) {
        showToast('error', 'Validation Error', errors.join('<br>'));
        return false;
    }
    
    return true;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show toast notification
function showToast(type, title, message) {
    const toastContainer = document.getElementById('messageContainer');
    const toastId = 'toast-' + Date.now();
    
    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <strong>${title}</strong><br>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        delay: 5000
    });
    
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}

// Set button loading state
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        const originalText = button.innerHTML;
        button.dataset.originalText = originalText;
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText;
    }
}

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(var(--bs-dark-rgb), 0.95)';
    } else {
        navbar.style.backgroundColor = 'rgba(var(--bs-dark-rgb), 0.8)';
    }
});

// Form field animations
document.querySelectorAll('.form-control, .form-select').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});
