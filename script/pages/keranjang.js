 
let currentData = [];

init();




async function init() {
    await getCart();      
    renderCart(currentData); 
    updateQtyProduct(currentData);   
    updateHarga();
}

async function getCart(){
  
  try{
      const response = await fetch("/Darikebun/php/getCart.php");

    
      if (response.status === 401) {
        alert('Anda telah logout!!');
        window.location.href = 'login.html';
        return;
      }

      currentData = await response.json();
      console.log(currentData);
      
    }catch(err){
      console.log(err);
    }
}


async function renderCart(dataProduct){

  const container = document.querySelector('.cart-container');
  container.innerHTML="";
  let card = ""

  dataProduct.forEach( product => {
        card += `
      <div class="cart-item cart-item-${product.product_id}" >
        <div class="image-wraper">
          <img src="${product.image}" class="cart-image">
        </div>

        <div class="cart-info">
            <div class="cart-name">${product.name}</div>
            <div class="cart-price">
              <span class="price-now">Rp ${Number(product.price).toLocaleString("id-ID")}</span>

              <div class="cart-qty" data-id="${product.product_id}">
                <button class="qty-btn minus-btn" >−</button>
                <span class="qty-number">${product.quantity}</span>
                <button class="qty-btn plus-btn" >+</button>
                <button class="delete-btn" >Delete</button>
              </div>
              
                    
            </div>
          
        </div>
      </div>
      `
  
  });
  container.innerHTML =card;
}

async function updateHarga(){

  await getCart();

  let total =0;
  currentData .forEach(product => {
    total += Number(product.price) * product.quantity;  
  })

  let totalPayment = total + 14000 + 2000

  document.querySelector('.price-all-product').innerHTML = total.toLocaleString("id-ID");
  document.querySelector('.total-price').innerHTML= totalPayment.toLocaleString("id-ID")
        
    
}

function updateQtyProduct(){

  document.querySelector('.cart-container').addEventListener('click',async (e) => {

      const btnMinus = e.target.closest('.minus-btn');
      const btnPlus = e.target.closest('.plus-btn');
      const btnDelete = e.target.closest('.delete-btn');

    if(btnMinus || btnPlus || btnDelete){
  
      const parent = e.target.closest('.cart-qty');
      const qtyNumber = parent.querySelector('.qty-number');
      const productId = parent.dataset.id;
      const action = btnMinus ? 'minus' : btnPlus ? 'plus' : 'delete';

     
      try{
          const response = await fetch("/Darikebun/php/updateCart.php",{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify({ productId, action })   
          }) 

          if (!response.ok) throw new Error("Gagal update keranjang");

          const result = await response.json(); 
          const newQty = result[0];

          // 3. Update UI
          qtyNumber.innerText = newQty;

          if( newQty[0] === '0'){
           e.target.closest('.cart-item').remove();
           console.log("klik delete");
          }
          updateHarga();

      }catch(err){
        console.error("Terdapat kesalahan:", err);
        
      }
    }

   
  })


}


async function checkout(dataProduct){

  const alamat = document.querySelector('.customer-address input').value
  const penerima = document.querySelector('.customer-name input').value

  try{
      const response = await fetch("/Darikebun/php/checkout.php",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
        body: JSON.stringify({
          alamat: alamat,
          penerima: penerima,
          cart: dataProduct
        })
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        alert("Pesanan Berhasil!");
        console.log(result);
        return true; 

      } else {
          alert("Gagal: " + result.message);
          console.log(result);
          return false;
      }

    
  }catch(err){
    console.log(err);
  }
}
async function handleCheckout() {
    const btn = document.querySelector('.pesan-button');
    const alamat = document.querySelector('.customer-address input').value;
    const nama = document.querySelector('.customer-name input').value;

    // Validasi sederhana
    if (!alamat || !nama) {
        alert("Mohon lengkapi nama dan alamat!");
        return;
    } 

    if(currentData.length === 0){
      alert("Keranjang kamu kosong!");
        return;
    }

    // Lock tombol
    btn.disabled = true;
    btn.style.opacity = "0.5";
    

    try {
        // Ambil data produk terbaru (bisa disimpan di variabel global atau selector)
        // Misal: const currentData =
        const isSuccess = await checkout(currentData); 

        if (isSuccess) {
            document.querySelector('.customer-address input').value = "";
            document.querySelector('.customer-name input').value = "";

            //merender ulang
            init();
           
        }
    } catch (err) {
        alert("Terjadi kesalahan koneksi.");
    }
    
}
document.querySelector('.pesan-button').addEventListener('click', handleCheckout); // klik untuk memesan




