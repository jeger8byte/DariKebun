import{updateCartIcon} from "../modules/utils.js"
updateCartIcon();


document.addEventListener("DOMContentLoaded", async () => {
    // 1. Ambil ID dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

   
    // 2. Fetch data dari database melalui PHP
    try {
        const response = await fetch(`/DariKebun/php/getDetail.php?id=${productId}`);
       
    // Jika server kirim 401 (dari validasiToken), lempar ke login
    if (response.status === 401) {
    alert('Sesi Anda habis, silakan login kembali!');
    window.location.href = 'login.html';
    return;
}  
      
        // Cek apakah response oke sebelum parsing JSON
    if (!response.ok) throw new Error("Gagal mengambil data dari server");

      
        const  dataProduct = await response.json();
        console.log(dataProduct);

       
        renderProduct(dataProduct.data); // Fungsi untuk menampilkan ke HTML
        addToCart(dataProduct.data);
        
        if (dataProduct.wishlisted) {
            document.querySelector('.wishlist-button').classList.add('active');
            setupWishlistListener(dataProduct.data);
        }else{
                setupWishlistListener(dataProduct.data)
        }
    } catch (error) {
        console.error("Gagal mengambil data:", error);
    }
});





 

//### MENAMBAHKAN dan MENGHAPUS PRODUK KE WISHLIST ### //
// Pastikan fungsi ini dipanggil setelah renderProduct selesai
function setupWishlistListener(dataProduct) {
    const btnWish = document.querySelector('.wishlist-button');
    let result=[];

    btnWish.addEventListener("click", async () => {
        // 1. Tentukan aksi berdasarkan apakah tombol sudah punya class 'active'
        const isCurrentlyWish = btnWish.classList.contains('active');
        const action = isCurrentlyWish ? 'remove' : 'add';
         
        try {
            const response = await fetch(`/DariKebun/php/insertWishlist.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id: dataProduct.id, 
                    name: dataProduct.name,
                    price: dataProduct.price,
                    image: dataProduct.image,
                    action: action
                })
            });

          
            result = await response.json();
            console.log(result);

            // 2. PINDAHKAN LOGIKA UPDATE UI KE DALAM SINI (Setelah dapat respon JSON)
            if (result.status === 'success') {
                if (action === 'add') {
                    btnWish.classList.add('active');
                    console.log("Berhasil ditambah ke wishlist");
                } else {
                    btnWish.classList.remove('active');
                    console.log("Berhasil dihapus dari wishlist");
                }
            } else {
                alert("Gagal: " + result.message);
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan koneksi");
        }
    });

    
}


//fungsi render halaman
function renderProduct(dataProduct){
//### MERENDER TAMPILAN HALAMAN ###//
const wrapper= document.querySelector('.buy-wrapper');
 
  wrapper.innerHTML = `
 <div class="buy-container">
          <div class="buy-container">
            <div class="buy-box">
              <div class="image-wrapper">
                <img class="product-image" src="${dataProduct.image}">
              </div>


              <div class="purchase-panel">
                <div class="row top-row">
                  <div class="product-stock">
                    Stok Total: <span>${dataProduct.stock}</span>
                  </div>
                </div>

               

                <button class="add-to-cart-button">
                  +Keranjang
                </button>

              </div> 
            </div>


            <div class="buy-detail">

              <div class="product-header">
                <div class="product-name">${dataProduct.name}</div>
                <button class="wishlist-button"> <i class="fa-solid fa-heart"></i></button>
              </div>

              <div class="product-price">Rp${Number(dataProduct.price).toLocaleString("id-ID")}</div>

              <div class="product-description">
                <div class="judul">Detail Produk</div>
                <div class="isi">${dataProduct.deskripsi}
                </div>
              </div>

            </div>
         </div>
</div>

    `;

  
}


//add to cart
async function addToCart(dataProduct){
  

    const button = document.querySelector('.add-to-cart-button');
    
    button.addEventListener("click",async () => {

    try{

      const response = await fetch(`/DariKebun/php/insertToCart.php`, {
          method: "POST",
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
          product_id: dataProduct.id,
          name: dataProduct.name,
          price:  dataProduct.price, 
          image: dataProduct.image
          
          })
      });

      //cek apakah server memberikan response
      if (!response.ok) {
              throw new Error(`Server error: ${response.status}`);
             
          }

          const data = await response.json();
          console.log("Respon dari PHP:", data);
          updateCartIcon();
          alert("Produk berhasil ditambahkan!");
          

    }catch(error){
      console.log("Error:",error);
    }
    })
     
}