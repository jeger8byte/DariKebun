const logOutBtn = document.querySelector('.logout');

logOutBtn.addEventListener('click', async ()=>{
  
  const response = await fetch("/DariKebun/php/logout.php",{
    method:"POST"
  })

})