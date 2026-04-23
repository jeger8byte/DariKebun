<?php

 require_once 'cek_token.php';
 require_once  '../config/env.php';
loadEnv(__DIR__ . '/../.env');
  //cek token 
  $secret = $_ENV['JWT_SECRET'];
  $userData = validasiToken($secret);

  
$conn = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);

if(isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST'){
 

    $nama_produk = $_POST['nama_produk'];
    $harga = $_POST['harga'];
    $deskripsi = $_POST['deskripsi'];
    $kategori = $_POST['kategori'];
    $stok = $_POST['stok'] ;

    // ambil file gambar //
    $imageName = $_FILES['image']['name']; //ambil nama file
    $imageTmp = $_FILES['image']['tmp_name']; //ambil lokasi sementara file di server

     // alamat folder untuk menyimpan gambar
    $folder = "../images/productImages/";
    $path = $folder .time() . "_" . $imageName;
    // pindahkan file ke folder yang telah ditentukan
    move_uploaded_file($imageTmp, $path);

    //alamat gambar yang akan disimpan di database (tidak error karena terjadi overwrite pada variabel $path)
    $path = "images/productImages/" .time() . "_" . $imageName;

    if(!$nama_produk || !$harga || !$kategori || !$stok){
        echo json_encode([
            "status" => "error",
            "message" => "Data tidak lengkap"
        ]);
        exit;
    }

    $sql = "INSERT INTO produk (name, price, stock, image, deskripsi, category) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("siisss", $nama_produk, $harga, $stok, $path, $deskripsi, $kategori);

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

    $stmt->close();
    $conn->close();
}

?>