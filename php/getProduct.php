<?php
require_once  '../config/env.php';
loadEnv(__DIR__ . '/../.env');
require_once 'cek_token.php';

//cek token 
$secret = $_ENV['JWT_SECRET'];
$userData = validasiToken($secret);

    
  
  $conn = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);
  //mengambil data produck berdasarkan kategori
  $kategori = $_GET['kategori'] ?? null;
  $sql = "SELECT * FROM produk WHERE category= ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("s",$kategori);
  $stmt->execute();
  $result = $stmt->get_result();
  $data = [];

  while($row = $result->fetch_assoc()){
    $product[] = $row;
    $data['products'] = $product;
  }

//mengambil jumlah produk yang dimiliki untuk ditampilkan di dashboard admin
  $sql_total_product = " SELECT COUNT(*) as total FROM produk";
  $stmt = $conn->prepare($sql_total_product);
  $stmt->execute();
  $result = $stmt->get_result();
  $row = $result->fetch_assoc();
  $data['total_products'] = $row;
   

 //mengambil data produk secara acak untuk ditampilkan di dashboard user
 $sql_random = "SELECT * FROM produk WHERE id >= FLOOR (RAND() * (SELECT MAX(id) FROM produk )) LIMIT 8";
 $stmt = $conn->prepare($sql_random);
 $stmt->execute();
 $result = $stmt->get_result();

 while($row = $result->fetch_assoc()){
  $product[] = $row;
   $data['random_products'] = $product;
 }

echo json_encode($data);

$stmt->close();
$conn->close();
?>
