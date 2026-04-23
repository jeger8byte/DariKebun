<?php


require_once  '../config/env.php';
loadEnv(__DIR__ . '/../.env');
require_once 'cek_token.php';
//cek token 
$secret = $_ENV['JWT_SECRET'];
$userData = validasiToken($secret);

    

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['status' => 'error', 'message' => 'Input tidak valid', 'wishlisted' => 'true']);
    exit;
}

$id_produk = $input['id']; // Menggunakan variabel $id
$user_id = $userData-> uid;
$action = $input['action'];
$name = $input['name'];
$price = $input['price'];
$image = $input['image'];

$conn = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);


if ($action === 'add') {
  
    $sql = "INSERT INTO wishlist (id, name, price, image,user_id) VALUES (?, ?, ?, ?,?)";
    $stmt = $conn->prepare($sql);
    
    $stmt->bind_param("isisi", $id_produk, $name, $price, $image,$user_id );
} else {
   
    $sql = "DELETE FROM wishlist WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_produk);
}

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => $conn->error]);
}

$stmt->close();
$conn->close();
?>