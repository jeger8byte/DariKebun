<?php
   require_once 'cek_token.php';
  //cek token 
  $secret = "RAHASIA_DARI_KEBUN_99_PASTI_AMAN"; 
  $userData = validasiToken($secret);

  
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
