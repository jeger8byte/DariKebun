<?php

$conn = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);

$keyword = $_GET['keyword'];
$kategori =$_GET['kategori'];
  // Gunakan LIKE untuk pencarian fleksibel
$query = "SELECT * FROM produk WHERE name LIKE ? AND category = ?";
$stmt = $conn->prepare($query);
$search = "%$keyword%";
$stmt->bind_param("ss", $search,$kategori);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}
echo json_encode($data);
?>