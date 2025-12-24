// Donate Modal Functions
function openDonateModal() {
  document.getElementById('donateModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeDonateModal() {
  document.getElementById('donateModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Initialize donate functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add click handlers for payment buttons
  const momoBtn = document.querySelector('.momo-new');
  const coffeeBtn = document.querySelector('.coffee-new');
  const paypalBtn = document.querySelector('.paypal-new');
  
  if (momoBtn) {
    momoBtn.addEventListener('click', function() {
      alert('Chuyển hướng đến MoMo...');
      closeDonateModal();
    });
  }
  
  if (coffeeBtn) {
    coffeeBtn.addEventListener('click', function() {
      alert('Chuyển hướng đến Buy me a coffee...');
      closeDonateModal();
    });
  }
  
  if (paypalBtn) {
    paypalBtn.addEventListener('click', function() {
      alert('Chuyển hướng đến PayPal...');
      closeDonateModal();
    });
  }
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const modal = document.getElementById('donateModal');
  if (event.target === modal) {
    closeDonateModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const modal = document.getElementById('donateModal');
    if (modal && modal.style.display === 'block') {
      closeDonateModal();
    }
  }
});