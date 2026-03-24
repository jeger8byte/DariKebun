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
$sql_insert = "INSERT INTO cart (product_id, user_id, name, price, quantity,image) 
        VALUES (?,?, ?, ?, ?,?) 
        ON DUPLICATE KEY UPDATE 
        quantity = quantity + VALUES(quantity)";

$stmt = $conn->prepare($sql_insert);
$stmt->bind_param("iisdis", $product_id,$user_id, $name, $price, $quantity,$image);

// 1. Update stok di database (dikurangi 1)
$sql_update = "UPDATE produk SET stock = stock - 1 WHERE id = ?";
$stmt_update = $conn->prepare($sql_update);
$stmt_update->bind_param("i", $product_id);
$stmt_update->execute();

// 2. Ambil nilai stok terbaru setelah di-update
$sql_get_stock = "SELECT stock FROM produk WHERE id = ?";
$stmt_get = $conn->prepare($sql_get_stock);
$stmt_get->bind_param("i", $product_id);
$stmt_get->execute();
$result = $stmt_get->get_result();
$row = $result->fetch_assoc();

$current_stock = $row['stock'];


if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Cart diperbarui',
    'stock'=>$current_stock]);
} else {
    echo json_encode(['status' => 'error', 'message' => $conn->error]);
}
?>