import{updateCartIcon} from "../modules/product.js"

updateCartIcon();

// mengambil id dari url untuk digunakan sebagai parameter fetch detail produk
const getProductId = () => new URLSearchParams(window.location.search).get('id');

async function fetchProductDetail(productId){
    const response =  await fetch(`/DariKebun/php/getDetail.php?id=${productId}`);

    if (response.status === 401) {
        alert('Anda telah logout!!');
        window.location.href = 'login.html';
        return;
    }

    if(!response.ok){
        throw new Error("FETCH_FAILED")
    }

    return await response.json();
}

document.addEventListener("DOMContentLoaded",async () =>{
    const productId = getProductId();
    if(!productId) return console.error("ID produk tidak ditemukan");

    try{
        const { data, wishlisted } = await fetchProductDetail(productId);
        
        renderProduct(data);
        addToCart(data);

        const wishlistBtn = document.querySelector('.wishlist-button');;

        if(wishlisted){
            wishlistBtn.classList.add('active')
        }

        setupWishlistListener(data);

    }catch (err){
  
        console.error("Gagal memuat detail produk:", err);
        
    }
})


function setupWishlistListener(dataProduct) {

    const btnWish = document.querySelector('.wishlist-button');
    
    btnWish.addEventListener("click", async () => {
       
        const isActive= btnWish.classList.contains('active');
        const action = isActive ? 'remove' : 'add';
         
        try {
            const response = await fetch(`/DariKebun/php/insertWishlist.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id: dataProduct.id, 
                    name: dataProduct.name,
                    price: dataProduct.price,
                    image: dataProduct.image,
                    action
                })
            });

            const result = await response.json();

            if (result.status === 'success') {
                btnWish.classList.toggle('active', action === 'add');

                console.log(` Produk ${action === 'add'?'ditambah ke': 'dihapus dari'} Wishlist `)
            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            console.error("Wishlist Error:", error);
            alert( error.message || "Terjadi kesalahan koneksi");
        }
    });

    
}

//fungsi render halaman
function renderProduct(dataProduct){

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
        </div> `;
}

function addToCart(dataProduct) {
    const btnAdd = document.querySelector('.add-to-cart-button');

    btnAdd.addEventListener("click", async () => {
        try {
           
            const response = await fetch(`/DariKebun/php/insertToCart.php`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: dataProduct.id,
                    name: dataProduct.name,
                    price: dataProduct.price,
                    image: dataProduct.image
                })
            });

           
            if (!response.ok) throw new Error(`Gagal menghubungi server (${response.status})`);

            const result = await response.json();

            if (result.status !== 'success') {
                throw new Error(result.message || "Gagal menambahkan ke keranjang");
            }

           
            updateCartUI(result.stock);
            alert("Produk berhasil ditambahkan!");

        } catch (error) {
            console.error("Cart Error:", error);
            alert(error.message || "Terjadi kesalahan koneksi");
        }
    });
}

// Fungsi tambahan agar logika update UI tidak menumpuk di fungsi utama
function updateCartUI(newStock) {
    updateCartIcon();
    const stockElement = document.querySelector('.product-stock span');
    if (stockElement) {
        stockElement.innerText = newStock;
    }
}