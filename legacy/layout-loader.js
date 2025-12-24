document.addEventListener('DOMContentLoaded', function() {
  // Load header
  fetch('../components/header.html')
    .then(response => {
      if (!response.ok) throw new Error('Header not found');
      return response.text();
    })
    .then(html => {
      const headerDiv = document.getElementById('header-placeholder');
      if (headerDiv) {
        headerDiv.innerHTML = html;
        // Highlight nav item based on current page
        const navLinks = headerDiv.querySelectorAll('.nav-link');
        // Lấy tên file hiện tại (ví dụ: index.html, about.html)
        const currentPath = window.location.pathname;
        const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);

        navLinks.forEach(link => {
          // Xóa class nav-active cũ (nếu có)
          link.classList.remove('nav-active');
          // So sánh href của link với tên file hiện tại
          if (link.getAttribute('href') === currentPage) {
            link.classList.add('nav-active');
          }
        });
      }
    })
    .catch(err => console.error('Error loading header:', err));

  // Load footer
  fetch('../components/footer.html')
    .then(response => {
      if (!response.ok) throw new Error('Footer not found');
      return response.text();
    })
    .then(html => {
      const footerDiv = document.getElementById('footer-placeholder');
      if (footerDiv) footerDiv.innerHTML = html;
    })
    .catch(err => console.error('Error loading footer:', err));

  // Load donate component (exclude from canvas page)
  const currentPath = window.location.pathname;
  const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  
  if (currentPage !== 'canvas.html') {
    fetch('../components/donate.html')
      .then(response => {
        if (!response.ok) throw new Error('Donate component not found');
        return response.text();
      })
      .then(html => {
        // Insert donate component before footer
        const footerDiv = document.getElementById('footer-placeholder');
        if (footerDiv) {
          footerDiv.insertAdjacentHTML('beforebegin', html);
          
          // Load donate CSS if not already loaded
          if (!document.querySelector('link[href*="donate.css"]')) {
            const donateCSS = document.createElement('link');
            donateCSS.rel = 'stylesheet';
            donateCSS.href = '../styles/donate.css';
            document.head.appendChild(donateCSS);
          }
          
          // Load donate JS if not already loaded
          if (!document.querySelector('script[src*="donate.js"]')) {
            const donateJS = document.createElement('script');
            donateJS.src = '../scripts/donate.js';
            document.body.appendChild(donateJS);
          }
        }
      })
      .catch(err => console.error('Error loading donate component:', err));
  }
});
