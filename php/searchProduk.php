<?php
  require_once 'cek_token.php';
  //cek token 
  $secret = "RAHASIA_DARI_KEBUN_99_PASTI_AMAN"; 
  $userData = validasiToken($secret);

$conn = new mysqli("localhost","root","","dari_kebun");

$keyword = $_GET['keyword'];
$kategori =$_GET['kategori'];
  // Gunakan LIKE untuk pencarian fleksibel
$query = "SELECT * FROM produk WHERE name LIKE ? AND kategori = ?";
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