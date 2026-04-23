

//mengecek apakah admin telah login atau sesi habis, jika ya maka akan diarahkan ke halaman login
async function cekLogin () {
  try {
    const response = await fetch("/DariKebun/php/adminAddProduct.php");
  
    if (!response.ok) {
      alert('Anda telah logout!');
      window.location.href = 'login.html';
    }
  }catch(err){
    console.error("Error:", err);
  }
} 
 cekLogin();



//mengambil id produk dari URL untuk digunakan dalam proses edit produk
const getProductId = () => new URLSearchParams(window.location.search).get('id');
const productId = getProductId();

// meload data produk yang akan diedit berdasarkan id produk yang diambil dari URL
document.addEventListener("DOMContentLoaded",async () =>{
    
    console.log(productId);
    if(!productId) return console.error("ID produk tidak ditemukan");

    try{
      //mengambil data produk yang akan diedit berdasarkan id produk yang diambil dari URL
      const response =  await fetch(`/DariKebun/php/adminEditProduct.php?id=${productId}`);
      const result = await response.json();
      console.log(result.data.image.split('/').pop().split('_').slice(1).join('_'));

      //menampilkan data produk sebelum di edit
      document.querySelector('#nama_produk').value = result.data.name;
      document.querySelector('#harga').value = result.data.price;
      document.querySelector('#deskripsi').value = result.data.deskripsi;
      document.querySelector('#stok').value = result.data.stock;
      document.querySelector('#kategori').value = result.data.category;
    
      
    }catch (err){
  
        console.error( err);
        
    }
})
//mengubah tampilan upload gambar ketika file gambar dipilih
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

// mengirim form data untuk ditambahkan ke database setelah data produk diedit
const addProductForm = document.querySelector('.form-container form');
addProductForm.addEventListener('submit', async (e) => {
  e.preventDefault();
 const formData = new FormData(addProductForm);
 formData.append("productId", productId);
    try {
        const response = await fetch(`/DariKebun/php/adminEditProduct.php`, {
            method: "POST",
            body: formData,
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
