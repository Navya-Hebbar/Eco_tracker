// Smooth Scroll for Navbar Links
document.querySelectorAll('.navbar nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
  
  // Form Validation for Contact Section
  const contactForm = document.querySelector('.contact form');
  const submitButton = document.querySelector('.contact form button');
  
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission
  
    let valid = true;
    
    const name = contactForm.querySelector('input[name="name"]');
    const email = contactForm.querySelector('input[name="email"]');
    const message = contactForm.querySelector('textarea[name="message"]');
    
    // Name Validation
    if (name.value.trim() === "") {
      valid = false;
      name.style.borderColor = 'red';
    } else {
      name.style.borderColor = '#ddd';
    }
  
    // Email Validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email.value.trim())) {
      valid = false;
      email.style.borderColor = 'red';
    } else {
      email.style.borderColor = '#ddd';
    }
  
    // Message Validation
    if (message.value.trim() === "") {
      valid = false;
      message.style.borderColor = 'red';
    } else {
      message.style.borderColor = '#ddd';
    }
  
    // Submit the form if valid
    if (valid) {
      // Show a simple alert (for now, replace with your backend logic)
      alert('Thank you for contacting us!');
      contactForm.reset(); // Reset form fields
    } else {
      alert('Please fill in all fields correctly.');
    }
  });
  
  // Animation for Fade-In Elements
  window.addEventListener('scroll', () => {
    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight) {
        element.classList.add('fade-in-visible');
      }
    });
  });
  
  // Add class to trigger fade-in animation when element is in view
  document.addEventListener('DOMContentLoaded', () => {
    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach(element => {
      element.classList.add('fade-in');
    });
  });
  