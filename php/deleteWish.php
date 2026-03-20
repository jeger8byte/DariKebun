<?php

$input = json_decode(file_get_contents('php://input'), true);

$id = $input['productId'];
$action = $input['action'];

$conn = new mysqli("localhost", "root", "", "dari_kebun");

if ($action === 'remove') {
    // Menghapus data berdasarkan ID
    $stmt = $conn->prepare("DELETE FROM wishlist WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => $conn->error]);
    }
    $stmt->close();
}
$conn->close();
?>