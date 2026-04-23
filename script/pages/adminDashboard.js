



//fungsi untuk mengambil data statistik dari database untuk ditampilkan di dashboard admin
async function getDashboardStats(){
 try{
  const response = await fetch("/Darikebun/php/adminDashboard.php");
  console.log(response);
  
    //cek apakah user telah login /sesi habis
    if (!response.ok) { 
      alert('Anda telah logout!');
      window.location.href = 'index.html';
      return;
    } 

   if(!response.ok){
     throw new Error(`HTTP error! status: ${response.status}`);
   }

  const data = await response.json();
 
  return data;

 }catch(err){
  console.log(err);
 }
}
//simpan data statistik yang sudah diambil dari database ke dalam variabel data
const data = await getDashboardStats();
console.log(data);

// menyesuaikan stat-value dari total produk dengan jumlah produk yang ada di database 
document.querySelector('.total-product').innerText = data.total_products;


//menyesuaikan stat-value dari total pesanan dengan jumlah user yang ada di database 
document.querySelector('.total-order').innerText = data.total_orders;



//menyesuaikan stat-value dari total pelanggandengan jumlah user yang ada di database 
document.querySelector('.total-customer').innerText = data.total_customers;

//menyesuaikan stat-value dari total revenue dengan jumlah user yang ada di database
document.querySelector('.total-revenue').innerText = `Rp ${data.total_revenue.toLocaleString('id-ID')}`;


//memasukkan semua produk ke tabel
let tableData = '';
data.products.forEach( (product,index) => {
  tableData +=`
    <tr>
        <td>${index +1}</td>
        <td><img src="${product.image}" alt="Produk" class="product-img"></td> <td>${product.name}</td>
        <td>${product.category}</td>
        <td>Rp ${product.price.toLocaleString()}</td>
        <td>${product.stock}</td>
        
        <td>
            <div class="action-buttons" data-id="${product.id}">
                <button class="edit-btn"><i class="fas fa-edit"></i> Edit</button>
                <button class="delete-btn"><i class="fas fa-trash-alt"></i> Hapus</button>
            </div>
        </td>
    </tr>   
  `
})
document.querySelector('.product-table tbody').innerHTML = tableData;


//memberikan aksi hapus dan edit produk pada tombol delete
document.querySelector('.product-table').addEventListener('click', async (e)=>{

   const btnDelete = e.target.closest('.delete-btn');
   const btnEdit = e.target.closest('.edit-btn');
    parent = e.target.closest('.action-buttons');
   const productId = parent.dataset.id;
   
  //menghapus produk ketika tombol delete diklik
   if(btnDelete){

     
   
    if (!confirm("Yakin nih mau hapus produk?")) return;
      // Jika sampai ke baris ini, berarti user klik OK
      alert("Produk Berhasil Dihapus");

      try{
        const response = await fetch(`/Darikebun/php/AdminDashboard.php`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({id: productId})
        });

        if(!response.ok){
           throw new Error('Gagal hapus data');
        }

        const result = await response.json();
         e.target.closest('.product-table tbody tr').remove();
        console.log(result);
        console.log( productId)

    }catch(err){
      console.log(err);
    }
  }

  if(btnEdit){
    window.location.href = `/Darikebun/adminEditProduct.html?id=${productId}`;
  }


  

})

//menuju ke halaman tambah produk ketika tombol tambah produk diklik
document.querySelector('.add-product-btn').addEventListener('click', () => {
  window.location.href = '/Darikebun/adminAddProduct.html';
})


// melakukan logout dari dashboard admin
const logOutBtn = document.querySelector('.logout-btn');
logOutBtn.addEventListener('click', async () => {
    const yakin = confirm("Yakin ingin keluar?");
    if (!yakin) return;

    try {
        const response = await fetch("/DariKebun/php/logout.php", {
            method: "POST"
        });

        if (response.ok) {
            // INI KUNCINYA: Langsung pindah ke login tanpa nunggu refresh manual
            alert("Berhasil logout!");
            window.location.href = 'login.html'; 
        } else {
            console.error("Gagal logout di server");
        }
    } catch (err) {
        console.error("Terjadi kesalahan koneksi:", err);
    }
});


    

