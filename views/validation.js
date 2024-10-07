document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('frm');
    
    form.addEventListener('submit', function(event) {
        const inputs = form.querySelectorAll('input[type="text"], input[type="number"], input[type="date"], select, textarea, input[type="email"], input[type="password"]');
        
        let isValid = true;
        inputs.forEach(function(input) {
            if (!input.value.trim()) {
                input.style.borderColor = 'red';
                isValid = false;
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (!isValid) {
            event.preventDefault();
            alert('Please fill in all required fields.');
        }
    });
});