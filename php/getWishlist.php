<?php

require_once  '../config/env.php';
loadEnv(__DIR__ . '/../.env');
require_once 'cek_token.php';

//cek token 
$secret = $_ENV['JWT_SECRET'];
$userData = validasiToken($secret);

    
$conn = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);

$user_id = $userData -> uid;
$sql = "SELECT * FROM wishlist WHERE user_id ='$user_id '";

$result = $conn->query($sql);

$data = [];

while($row = $result->fetch_assoc()){
  $data[] = $row;
}

echo json_encode($data);
?>
