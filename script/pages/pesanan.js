

let currentData = [];
init();



let card ='';

async function init(){
 await getPesanan();
 renderOrder(currentData);
}

async function getPesanan(){

  try{
     const response = await fetch("/Darikebun/php/getPesanan.php");

     //cek apakah user ttelah login
    if (response.status === 401) {
    alert('Silakan login kembali!');
    window.location.href = 'login.html';
    return;
    };
     currentData = await response.json();
      console.log(currentData);

  }catch(err){
    console.log(err)
  }

} 

function renderOrder(data){
  const container = document.querySelector('.container')

  let listItem = '';
  let card ='';
  
  data.forEach( produk =>{

    produk.daftar_barang.slice(1).forEach(barang => {
       listItem +=`
        <div class="order-product">
          <div class="image-wraper">
            <img src="${barang.produk_image}">
          </div>
          <div class="info-product">
            <span class="name">${barang.produk_nama}</span>
            <span class="qty">x${barang.quantity}</span>
            <span class="price">Rp${Number(barang.harga).toLocaleString("id-ID")}</span>
          </div>
        </div>`
    })

    card += `
    <div class="card">
          <div class="order-header">
            <div class="id-pesanan">Id Pesanan:${produk.id}</div>
            <div class="status">${produk.status}</div>
          </div>

          <div class="order-product">
            <div class="image-wraper">
              <img src="${produk.daftar_barang[0].produk_image}" class="cart-image">
            </div>
            <div class="info-product">
              <span class="name">${produk.daftar_barang[0].produk_nama}</span>
              <span class="qty">x${produk.daftar_barang[0].quantity}</span>
              <span class="price">Rp${Number(produk.daftar_barang[0].harga).toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div class="hidden-details detail-${produk.id}" style="display: none;">
            <div class="order-list">${listItem}</div>
          
            
            <div class="shipping-info">
                <p><strong>Penerima:</strong>${produk.penerima}</p>
                <p><strong>Alamat:</strong> ${produk.alamat_kirim}</p>
            </div>
          </div>

          <div class="order-footer">
            <span class="total-product">x${produk.daftar_barang.length} Produk</span>
            <div class="total-order">
              Total Pesanan: <span>Rp${Number(produk.total_harga).toLocaleString("id-ID")}</span>
            </div>      
          </div>

          <button class="btn-lihat btn-lihat-${produk.id}" >Lihat Detail Produk </button>
    </div> `



    

    
  })

  console.log("list item",card)
  container.innerHTML = card;

  // EVENT DELEGATION 
  container.addEventListener('click', e =>{
    if(e.target.classList.contains('btn-lihat')){

      const tombol = e.target
      console.log(tombol);
      //mencari card tempat tombol berada
      const cardInduk = tombol.closest('.card');
      const detailDiv = cardInduk.querySelector('.hidden-details')

      //logic
      if (detailDiv.style.display === "none") {
      detailDiv.style.display = "block";
      tombol.innerText = "Tutup Detail";

      } else {
      detailDiv.style.display = "none";
      tombol.innerText = "Lihat Detail Produk";

      }

    }
  })





}



