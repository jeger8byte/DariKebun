
export async function loadProduk(kategori){
  const container = document.querySelector(".product-container");

  try{
    //mengirim request
    // tanda (/sebelum Darikebun) memastikan browser selalu mencari dari folder www (root localhost).
    const response = await fetch(`/DariKebun/php/getProduct.php?kategori=${kategori}`)
      
    
     //cek apakah user telah login /sesi habis
    if (response.status === 401) { 
      alert('Anda telah logout!');
      window.location.href = 'index.html';
      return;
    } 

    //mengubah dari JSON ke array of object
    const data = await response.json()
    console.log(data.products);
    
    //merender produk
    let card= '';
      data.products.forEach(item => {
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

  }catch(error){
    console.log(error)
  }
}



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

  document.querySelector('.product-container').addEventListener('click',(e)=>{
    const imageClick = e.target.closest('.product-image');
    const id = imageClick.dataset.id;
   
    if(imageClick){
      
       window.location.href = `detailProduk.html?id=${id}`;
    }
    
  });

}
export async function searchProductOrLoad(kategori){

  const input = document.querySelector('.search-bar')
  const container = document.querySelector(".product-container");
  
 
  input.addEventListener('input',async function (){
     let keyword = this.value;
      
      try{  
        if(keyword.length >1){
          const response =  await fetch(`/Darikebun/php/searchProduk.php?keyword=${keyword}&kategori=${kategori}`)

           
            const data = await response.json();
            console.log(data);
              
              //merender produk
            let card= '';
              data.forEach(item => {
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
              `
              })
              container.innerHTML = card;
              
          
        }else{
          console.log('hai')
          loadProduk(kategori);
        }
      } catch(err){
        console.log(err)
      }
  
  })
}



  