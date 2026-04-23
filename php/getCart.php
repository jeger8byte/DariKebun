<?php

require_once 'cek_token.php';
require_once  '../config/env.php';
loadEnv(__DIR__ . '/../.env');
//cek token 
$secret = $_ENV['JWT_SECRET'];
$userData = validasiToken($secret);

$user_id = $userData-> uid; 
$conn = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);

$sql = "SELECT *FROM cart WHERE user_id = ? ";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i",$user_id);
$stmt->execute();

$result = $stmt->get_result();

$data=[];
while($row = $result->fetch_assoc()){
  $data[]=$row;
}

echo json_encode($data);
$stmt->close();
$conn->close();
?>