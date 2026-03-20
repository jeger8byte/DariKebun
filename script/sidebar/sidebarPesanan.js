const icon = document.querySelector('.search-icon');
const input = document.querySelector('.search-bar');

// Menu toogle
const toggle = document.querySelector('.toggle');
const sidebar = document.querySelector('.navigation');
const container = document.querySelector('.container');


toggle.addEventListener('click', () => {
  
  container.classList.toggle('active')
  sidebar.classList.toggle('active')
  
  
});