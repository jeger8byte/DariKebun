const container = document.getElementById('container')
const registerBtn = document.getElementById('register')
const loginBtn = document.getElementById('login')

registerBtn.addEventListener('click',()=>{
  container.classList.add("active")
})

loginBtn.addEventListener('click',()=>{
  container.classList.remove("active")
})

//login
const signInForm = document.querySelector('.sign-in form')

signInForm.addEventListener('submit',async (e)=>{
e.preventDefault(); // hentikan perilaku bawaan browser

    const formData = new FormData(signInForm); // mengambil semua isi form
    
    const response = await fetch("/DariKebun/php/login.php",{
      method:"POST",
      body: formData
    });

    const result = await response.json();
   

    //meletakkan token di local storage
    if( result.status === "user"){
      alert(result.message)
      window.location.href = 'dashboard.html';
    }else if(result.status === "admin"){
      alert(result.message)
      window.location.href = 'adminDashboard.html';
    }else{
      alert(result.message)
    }
})





