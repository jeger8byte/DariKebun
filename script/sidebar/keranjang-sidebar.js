const icon = document.querySelector('.search-icon');
const input = document.querySelector('.search-bar');

// Menu toogle
const toggle = document.querySelector('.toggle');
const sidebar = document.querySelector('.navigation');

const cekout= document.querySelector(".checkout-container")

toggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
   cekout.classList.toggle('active');
  
 
});