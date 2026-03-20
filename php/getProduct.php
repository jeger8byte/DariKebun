<?php
$conn = new mysqli("localhost","root","","dari_kebun");

$kategori = $_GET['kategori'];

$sql = "SELECT * FROM produk WHERE kategori='$kategori'";

$result = $conn->query($sql);

$data = [];

while($row = $result->fetch_assoc()){
  $data[] = $row;
}

echo json_encode($data);
?>
