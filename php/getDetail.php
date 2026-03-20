<?php
$conn = new mysqli("localhost","root","","dari_kebun");

$id = $_GET['id'];

$sql = "SELECT * FROM produk WHERE id='$id'";

$result = $conn->query($sql);

$data = $result->fetch_assoc();

echo json_encode($data);
?>
