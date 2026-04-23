
import { updateCartIcon,seeDetail } from "../modules/product.js";


updateCartIcon() ;
getWish()

async function getWish(){
  try{

     const response = await fetch(`/DariKebun/php/getWishlist.php`)

     //cek apakah user ttelah login
    if (response.status === 401) {
    alert('Anda telah logout!');
    window.location.href = 'login.html';
    return;}

     const data = await response.json();

     if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
     }


       const wrapper = document.querySelector('.product-container')
      wrapper.innerHTML="";

      // menampilkan product wishlish
      let card=''
      data.forEach(product => {
      card += `
        <div class="product-card" ">
                  
                <div class=" product">
                  <div class="image-wrapper">
                    <img class="product-image" data-id="${product.id} " src="${product.image}">
                  </div>
                    
                    <div class="product-content">
                      <p class="product-name">${product.name}</p>
                      <p class="product-price">Rp${Number(product.price).toLocaleString("id-ID")}</p>
                    </div>
                </div>
                <button class="remove-btn" data-id="${product.id}">✖</button>      
          </div>
        
        ` 
      
      })
      wrapper.innerHTML = card;
      deleteWish();
      seeDetail();
  
  }catch(err){
    console.log(err);
  }
 

} 

function deleteWish(){
document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener("click", async () => {
        const id = btn.dataset.id; // Mengambil ID dari atribut data-id
        // 1. Simpan referensi elemen pembungkus produk
            const itemElement = btn.closest('.product-card');

        try {
            const response = await fetch(`/DariKebun/php/deleteWish.php`, {
                method: 'POST', // Atau 'DELETE' tergantung cara PHP Anda menangkap
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    productId: id, 
                    action: 'remove' 
                })
            });

            const result = await response.json();
            
            if (result.status === 'success') {
                // Hapus elemen dari tampilan jika berhasil di database
                itemElement.remove();
                console.log("Berhasil dihapus dari database");
            } else {
                alert("Gagal menghapus: " + result.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});

}