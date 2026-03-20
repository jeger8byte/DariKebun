<?php
// insertToCart.php
$data = json_decode(file_get_contents('php://input'), true);

if(!$data){
    echo "data belum masuk";
    exit;
}

$id = $data['id'];
$name = $data['name'];
$price = $data['price'];
$image = $data['image'];
$quantity = 1;
// Koneksi database
$conn = new mysqli("localhost", "root", "", "dari_kebun");

// Query Upsert:
// Jika product_id sudah ada, maka tambahkan (quantity + VALUES(quantity))
// Jika belum ada, masukkan data baru.
$sql = "INSERT INTO cart (id, name, price, quantity,image) 
        VALUES (?, ?, ?, ?,?) 
        ON DUPLICATE KEY UPDATE 
        quantity = quantity + VALUES(quantity)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("isdis", $id, $name, $price, $quantity,$image);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Cart diperbarui']);
} else {
    echo json_encode(['status' => 'error', 'message' => $conn->error]);
}
?>