<?php


$input = json_decode(file_get_contents('php://input'), true);

$id = $input['id']; // Menggunakan variabel $id
$action = $input['action'];
$name = $input['name'];
$price = $input['price'];
$image = $input['image'];

$conn = new mysqli("localhost", "root", "", "dari_kebun");

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Koneksi gagal']));
}

if ($action === 'add') {
    // 1. Urutan kolom: id, name, price, image, action
    $sql = "INSERT INTO wishlist (id, name, price, image) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    
    // 2. Tipe data: id(i), name(s), price(i), image(s), action(s)
    // Gunakan 'i' untuk integer, 's' untuk string
    $stmt->bind_param("isis", $id, $name, $price, $image);
} else {
    // 3. Menggunakan variabel $id yang sudah didefinisikan di atas
    $sql = "DELETE FROM wishlist WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
}

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => $conn->error]);
}

$stmt->close();
$conn->close();
?>