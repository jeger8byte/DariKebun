<?php
require_once 'cek_token.php';
//cek token 
$secret = "RAHASIA_DARI_KEBUN_99_PASTI_AMAN"; 
$userData = validasiToken($secret);

$conn = new mysqli("localhost","root","","dari_kebun");

$produk_id = $_GET['id'];


// Cek apakah kombinasi User ID dan Produk ID ini ada di tabel wishlist
$check = $conn->prepare("SELECT id FROM wishlist WHERE id = ?");
$check->bind_param("i",$produk_id);
$check->execute();
$result = $check->get_result();

// Jika ada baris yang ditemukan, berarti sudah di-wishlist
$is_wishlisted = ($result->num_rows > 0);

//ambil data sari tabel produk 
$sql = "SELECT * FROM produk WHERE id='$produk_id'";

$result = $conn->query($sql);

$data = $result->fetch_assoc();

echo json_encode([
  "data" => $data,
  "wishlisted" => $is_wishlisted
]);
?>
