<?php
// insertToCart.php

require_once "cek_token.php";
  //cek token 
  $secret = "RAHASIA_DARI_KEBUN_99_PASTI_AMAN"; 
  $userData = validasiToken($secret);

//ambil request
$data = json_decode(file_get_contents('php://input'), true);

if(!$data){
    echo "data belum masuk";
    exit;
}

// Koneksi database
$conn = new mysqli("localhost", "root", "", "dari_kebun");

$product_id = $data['product_id'];
$user_id = $userData -> uid; 
$name = $data['name'];
$price = $data['price'];
$image = $data['image'];
$quantity = 1;


// Query Upsert:
// Jika product_id sudah ada, maka tambahkan (quantity + VALUES(quantity))
// Jika belum ada, masukkan data baru.
$sql = "INSERT INTO cart (product_id, user_id, name, price, quantity,image) 
        VALUES (?,?, ?, ?, ?,?) 
        ON DUPLICATE KEY UPDATE 
        quantity = quantity + VALUES(quantity)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iisdis", $product_id,$user_id, $name, $price, $quantity,$image);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Cart diperbarui']);
} else {
    echo json_encode(['status' => 'error', 'message' => $conn->error]);
}
?>