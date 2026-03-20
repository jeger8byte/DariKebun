const icon = document.querySelector('.search-icon');
const input = document.querySelector('.search-bar');

// Menu toogle
const toggle = document.querySelector('.toggle');
const sidebar = document.querySelector('.navigation');
const product = document.querySelector('.product-container');
const judul = document.querySelector('.judul');

toggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  product.classList.toggle('active');
  judul.classList.toggle('active');
  
  
  
 
});