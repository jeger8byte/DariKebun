const container = document.getElementById('container')
const registerBtn = document.getElementById('register')
const loginBtn = document.getElementById('login')

registerBtn.addEventListener('click',()=>{
  container.classList.add("active")
})

loginBtn.addEventListener('click',()=>{
  container.classList.remove("active")
})

//mengambil response
const signInForm = document.querySelector('.sign-in form')

signInForm.addEventListener('submit',async (e)=>{
e.preventDefault(); // hentikan perilaku bawaan browser

    const formData = new FormData(signInForm); // mengambil semua isi form
    
    const response = await fetch("/DariKebun/php/login.php",{
      method:"POST",
      body: formData
    });

    const result = await response.json();
  console.log(result);
  console.log(formData)
    //meletakkan token di local storage
    if( result.status === "success"){
      alert(result.message)
      window.location.href = 'dashboard.html';
    }else{
      alert(result.message)
    }
})
