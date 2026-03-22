// update angka di icon cart




export async function updateCartIcon() {
  
try{
    const response = await fetch("/Darikebun/php/getCart.php");

    const data = await response.json();
    const jumlah_item = data.length;

    let cartIconQuantity = document.querySelector('.cart-quantity')

    cartIconQuantity.innerHTML = jumlah_item;

  }catch(err){
    console.log(err);
  }
}

export function seeDetail() {
  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      
      // Pindahkan user ke halaman detail dengan membawa ID di URL
      // Contoh: detailProduk.html?id=123
      window.location.href = `detailProduk.html?id=${id}`;
    });
  });
}

