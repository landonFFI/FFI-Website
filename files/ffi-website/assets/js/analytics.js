// Vercel Web Analytics initialization
// This script loads and initializes Vercel Analytics for static HTML pages
(function() {
  // Vercel Analytics inject script
  window.va = window.va || function () { 
    (window.vaq = window.vaq || []).push(arguments); 
  };
  
  // Load the analytics script from Vercel's CDN
  var script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.appendChild(script);
})();
