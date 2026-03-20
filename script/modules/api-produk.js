export {loadProduk}

async function loadProduk(kategori){
  const container = document.querySelector(".product-container");

  try{
    //mengirim request
    // tanda (/sebelum Darikebun) memastikan browser selalu mencari dari folder www (root localhost).
    const response = await fetch(`/DariKebun/php/getProduct.php?kategori=${kategori}`)

    // Validasi response: Pastikan server menjawab dengan status 200
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
    tambahEvent(data);

  }catch(error){
    console.log(error)
  }
}


function tambahEvent(data) {
  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      
      // Pindahkan user ke halaman detail dengan membawa ID di URL
      // Contoh: detailProduk.html?id=123
      window.location.href = `detailProduk.html?id=${id}`;
    });
  });
}

