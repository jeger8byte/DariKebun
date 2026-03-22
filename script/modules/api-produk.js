import {seeDetail} from"./utils.js"

export async function loadProduk(kategori){
  const container = document.querySelector(".product-container");

  try{
    //mengirim request
    // tanda (/sebelum Darikebun) memastikan browser selalu mencari dari folder www (root localhost).
    const response = await fetch(`/DariKebun/php/getProduct.php?kategori=${kategori}`)

    //cek apakah user ttelah login
    if (response.status === 401) {
    alert('Sesi Anda habis, silakan login kembali!');
    window.location.href = 'login.html';
    return;
}   
    //mengubah dari JSON ke array of object
    const data = await response.json()
    
   
    //merender produk
    let card= '';
      data.forEach(item => {
        card += `
      <div class="product-card" data-id="${item.id}">
        <div class="image-wrapper">
          <img class="product-image" src="${item.image}">
        </div>
        
        <div class="product-content">
          <p class="product-name">${item.name}</p>
          <p class="product-price">Rp ${Number(item.price).toLocaleString("id-ID")}</p>
        </div>
      </div>
      `;

      console.log(item.image)
    });

    container.innerHTML = card;
    seeDetail();

  }catch(error){
    console.log(error)
  }
}


