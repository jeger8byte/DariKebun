<?php


require_once "cek_token.php";
$secret = "RAHASIA_DARI_KEBUN_99_PASTI_AMAN"; 
$userData = validasiToken($secret);



header('Content-Type: application/json');
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

$conn = new mysqli("localhost", "root", "", "dari_kebun");

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Koneksi gagal']));
}

if ($action === 'add') {
    // 1. Urutan kolom: id, name, price, image, action
    $sql = "INSERT INTO wishlist (id, name, price, image,user_id) VALUES (?, ?, ?, ?,?)";
    $stmt = $conn->prepare($sql);
    
    // 2. Tipe data: id(i), name(s), price(i), image(s), action(s)
    // Gunakan 'i' untuk integer, 's' untuk string
    $stmt->bind_param("isisi", $id_produk, $name, $price, $image,$user_id );
} else {
    // 3. Menggunakan variabel $id yang sudah didefinisikan di atas
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