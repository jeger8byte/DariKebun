<?php
require_once 'cek_token.php';
require_once  '../config/env.php';
loadEnv(__DIR__ . '/../.env');
//cek token 
$secret = $_ENV['JWT_SECRET'];
validasiToken($secret);

$conn = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);

$product_id = $_GET['id'];


// Cek apakah kombinasi User ID dan Produk ID ini ada di tabel wishlist
$sqlWish= "SELECT id FROM wishlist WHERE id = ?";
$stmtWish = $conn->prepare($sqlWish);
$stmtWish->bind_param("i",$product_id);
$stmtWish->execute();
$resultWish = $stmtWish->get_result();

// Jika ada baris yang ditemukan, berarti sudah di-wishlist
$is_wishlisted = ($resultWish->num_rows > 0);

//ambil data sari tabel produk 
$sql = "SELECT * FROM produk WHERE id= ? ";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i",$product_id);
$stmt->execute();

$result = $stmt->get_result();

$data = $result->fetch_assoc();

echo json_encode([
  "data" => $data,
  "wishlisted" => $is_wishlisted
]);

$stmt->close();
$stmtWish->close();
$conn->close();
?>
