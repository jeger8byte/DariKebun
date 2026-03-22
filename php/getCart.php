<?php

  require_once 'cek_token.php';
  //cek token 
  $secret = "RAHASIA_DARI_KEBUN_99_PASTI_AMAN"; 
  $userData = validasiToken($secret);

$user_id = $userData-> uid; 
$conn = new mysqli("localhost","root","","dari_kebun");
$sql = "SELECT *FROM cart WHERE user_id ='$user_id' ";
$result = $conn -> query($sql);

$data=[];
while($row = $result->fetch_assoc()){
  $data[]=$row;
}

echo json_encode($data)

?>