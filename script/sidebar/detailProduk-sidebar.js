const icon = document.querySelector('.search-icon');
const input = document.querySelector('.search-bar');

// Menu toogle
const toggle = document.querySelector('.toggle');
const sidebar = document.querySelector('.navigation');
const buyContainer = document.querySelector('.buy-container');


toggle.addEventListener('click', () => {
  
  buyContainer.classList.toggle('active')
  sidebar.classList.toggle('active')
  
  
 
});