


 
let currentData = [];

init();
// Inisialisasi event listener SEKALI saja saat halaman load
document.querySelector('.pesan-button').addEventListener('click', handleCheckout);


async function init() {
    await getCart();      // Tunggu sampai data masuk ke currentData
    renderCart(currentData); 
    updateQty();          // Panggil ini SETELAH element di-render
}

async function getCart(){
  
  try{
    const response = await fetch("/Darikebun/php/getCart.php");

    //cek apakah user telah login
    if (response.status === 401) {
    alert('Sesi Anda habis, silakan login kembali!');
    window.location.href = 'login.html';
    return;}

    const data = await response.json();
    currentData = data;
  }catch(err){
    console.log(err);
  }
}

//render produk cart
async function renderCart(dataProduct){
  const container = document.querySelector('.cart-container');
  container.innerHTML="";
  let card = ""
  dataProduct.forEach( product => {
        card += `
      <div class="cart-item cart-item-${product.id}" >
        <div class="image-wraper">
          <img src="${product.image}" class="cart-image">
        </div>

        <div class="cart-info">
          <div class="cart-name">${product.name}</div>
            <div class="cart-price">
              <span class="price-now">Rp ${Number(product.price).toLocaleString("id-ID")}</span>

              <div class="cart-qty">
                <button class="qty-btn minus-btn" data-id="${product.id}">−</button>
                <span class="qty-number">${product.quantity}</span>
                <button class="qty-btn plus-btn" data-id="${product.id}">+</button>
              </div>
                    
            </div>
        </div>
      </div>
      `
  
  });
  container.innerHTML =card;

  //hitung total harga 
  let total =0;
  dataProduct.forEach(product => {
    total += Number(product.price) * product.quantity;
    
  })
  document.querySelector('.price-all-product').innerHTML = total.toLocaleString("id-ID");
  
  //hitung total pembayaran
  document.querySelector('.total-price').innerHTML= total.toLocaleString("id-ID");
 
}


function updateQty(){

   let action = "";


   //event delegation button mines
   document.querySelector('.cart-qty').addEventListener('click',e => {

    if(e.target.classList.contains('minus-btn')){
      
    }
   })
  // mengurangi qty
  document.querySelectorAll('.minus-btn').forEach(btnMinus =>{
    btnMinus.addEventListener("click",async()=>{ 
        
      const id = btnMinus.dataset.id;
      action ="minus";
      
      try{
        const response = await fetch("/Darikebun/php/updateCart.php",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          id:id,
          action: action
        })
      }) 

      const quantity = await response.json();
      document.querySelector('.qty-number').innerHTML=quantity;

      init();

      if(quantity === 0){
        btn.closest('.cart-item').remove();
      }

      }catch(err){
        console.log("Terdapat kesalahan:",err)
      }
      
     
      
    })  
  })

  // menambah qty
 document.querySelectorAll('.plus-btn').forEach(btnPlus =>{
    btnPlus.addEventListener("click",async ()=>{

      const id = btnPlus.dataset.id;
      action ="plus";
      
      try{
          const response = await fetch("/Darikebun/php/updateCart.php",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            id:id,
            action: action
          })
        }) 

        const quantity = await response.json();
        
        document.querySelector('.qty-number').innerHTML=quantity;
       
      init();

        
      }catch(err){
        console.log("Terdapat kesalahan:",err)

      } 
       
    })  
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
    console.log(result);
    if (result.status === 'success') {
      alert("Pesanan Berhasil!");
      console.log(result);

      return true; // Beri tanda sukses
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
        // Misal: const currentData = ... 
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

//perbaiki masalah kedip ketika quantity di update



