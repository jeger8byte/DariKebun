<?php
require_once 'cek_token.php';
require_once  '../config/env.php';
loadEnv(__DIR__ . '/../.env');
//cek token 
$secret = $_ENV['JWT_SECRET'];
$userData = validasiToken($secret);

$conn = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $product_id = $_GET['id'];
  //ambil data dari tabel produk berdasarkan id produk yang dikirimkan 
  $sql = "SELECT * FROM produk WHERE id= ? ";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i",$product_id);
  $stmt->execute();
  $result = $stmt->get_result();
  $data = $result->fetch_assoc();
 

  echo json_encode([
    "data" => $data,
  ]);

}


//mengededit data produk berdasarkan id produk yang dikirimkan
if( $_SERVER['REQUEST_METHOD'] === 'POST'){
    $nama_produk = $_POST['nama_produk'];
    $harga = $_POST['harga'];
    $deskripsi = $_POST['deskripsi'];
    $kategori = $_POST['kategori'];
    $stok = $_POST['stok'] ;
    $product_id = $_POST['productId'];

    // ambil gambar lama dari database untuk digunakan jika tidak ada gambar baru yang diupload
    $sqlOld = "SELECT image FROM produk WHERE id = ?";
    $stmtOld = $conn->prepare($sqlOld);
    $stmtOld->bind_param("i", $product_id);
    $stmtOld->execute();
    $resultOld = $stmtOld->get_result();
    $oldData = $resultOld->fetch_assoc();
    $oldImage = $oldData['image'];

    if(isset($_FILES['image']) && $_FILES['image']['error'] === 0){
      // ambil file gambar //
      $imageName = $_FILES['image']['name']; //ambil nama file
      $imageTmp = $_FILES['image']['tmp_name']; //ambil lokasi sementara file di server

      // alamat folder untuk menyimpan gambar
      $folder = "../images/productImages/";
      $path = $folder .time() . "_" . $imageName;
      // pindahkan file ke folder yang telah ditentukan
      move_uploaded_file($imageTmp, $path);

      //alamat gambar yang akan disimpan di database 
      $pathImage = "images/productImages/" .time() . "_" . $imageName;
    }else{
      $pathImage = $oldImage; //jika tidak ada gambar yang diupload, gunakan gambar lama
    }

    if(!$nama_produk || !$harga || !$kategori || !$stok){
        echo json_encode([
            "status" => "error",
            "message" => "Data tidak lengkap"
        ]);
        exit;
    }

    $sql = "UPDATE produk 
        SET name = ?, 
            price = ?, 
            stock = ?, 
            image = ?, 
            deskripsi = ?, 
            category = ?
        WHERE id = ?";
        
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
      "siisssi",
      $nama_produk,
      $harga,
      $stok,
      $pathImage,
      $deskripsi,
      $kategori,
      $product_id
    );

    if($stmt->execute()){
        echo json_encode([
            "status" => "success",
            "message" => "Produk berhasil ditambahkan"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Gagal menambahkan produk"
        ]);
    }
   
}

//menutup koneksi
$stmt->close();
$conn->close();
?>
