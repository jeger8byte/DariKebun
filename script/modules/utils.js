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
