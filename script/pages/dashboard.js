import { seeDetail,updateCartIcon } from "../modules/product.js";

console.log("dashboard")
loadProduk();

 async function loadProduk(){
  const container = document.querySelector(".product-container");
  try{
    //mengirim request
    // tanda (/sebelum Darikebun) memastikan browser selalu mencari dari folder www (root localhost).
    const response = await fetch(`/DariKebun/php/getProduct.php`)
      
    //mengubah dari JSON ke array of object
    const data = await response.json()
    const result = data.random_products;
  
     //cek apakah user telah login /sesi habis
    if (response.status === 401) { 
      alert('Anda telah logout!');
      window.location.href = 'login.html';
      return;
    } 
    //merender produk
    let card= '';
      result.forEach(item => {
        card += `
      <div class="product-card" >
        <div class="image-wrapper">
          <img class="product-image" data-id="${item.id}" src="${item.image}">
        </div>
        
        <div class="product-content">
          <p class="product-name">${item.name}</p>
          <p class="product-price">Rp ${Number(item.price).toLocaleString("id-ID")}</p>
        </div>
      </div>
      `; 
    });

    container.innerHTML = card;
    seeDetail();
    updateCartIcon();

  }catch(error){
    console.log(error)
  }
}

