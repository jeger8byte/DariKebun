<?php
   require_once 'cek_token.php';
  //cek token 
  $secret = "RAHASIA_DARI_KEBUN_99_PASTI_AMAN"; 
  $userData = validasiToken($secret);

$conn = new mysqli("localhost","root","","dari_kebun");

$user_id = $userData -> uid;
$sql = "SELECT * FROM wishlist WHERE user_id ='$user_id '";

$result = $conn->query($sql);

$data = [];

while($row = $result->fetch_assoc()){
  $data[] = $row;
}

echo json_encode($data);
?>
