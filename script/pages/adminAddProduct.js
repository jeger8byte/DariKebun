
//mengecek apakah admin telah login atau sesi habis, jika ya maka akan diarahkan ke halaman login
async function cekLogin () {
  try {
    const response = await fetch("/DariKebun/php/adminAddProduct.php");
  
    if (!response.ok) {
      alert('Anda telah logout!');
      window.location.href = 'index.html';
    }
  }catch(err){
    console.error("Error:", err);
  }
} 
 cekLogin();



    

//mengubah tampilan upload gambar ketika file dipilih
const inputImage = document.querySelector('.image');
const uploadBox = document.querySelector('.upload-box');
inputImage.addEventListener('change', function () {
    console.log(this.files);
    if (this.files.length > 0) {
        uploadBox.innerHTML = `<div>${this.files[0].name}</div>`;
    } else {
        uploadBox.innerHTML = `<div>Tidak ada file yang dipilih</div>`;
    }
});


// mengirim form data untuk ditambahkan ke database
const addProductForm = document.querySelector('.form-container form')
addProductForm.addEventListener('submit', async (e) => {
  e.preventDefault();
 const formData = new FormData(addProductForm);

    try {
        const response = await fetch("/DariKebun/php/adminAddProduct.php", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        console.log(result);
        if (result.status === "success") {
            alert(result.message);
            window.location.href = "adminDashboard.html";
        } else {
            alert(result.message);
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan server");
    }
})