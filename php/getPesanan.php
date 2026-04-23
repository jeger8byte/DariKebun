<?php

require_once  '../config/env.php';
loadEnv(__DIR__ . '/../.env');
require_once 'cek_token.php';

//cek token 
$secret = $_ENV['JWT_SECRET'];
$userData = validasiToken($secret);

    
  $conn = new mysqli ($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);
  $user_id = $userData-> uid;

  // ambil semua pesanan
  $sql_orders = "SELECT * FROM orders WHERE user_id ='$user_id'";
  $result = $conn->query($sql_orders);
  $data = [];

 $order=[];
while($row = $result->fetch_assoc()){
  $order_id= $row['id'];

  //ambil barang untuk pesanan ini saja (berdasarkan id)
  $sql_items = "SELECT * FROM order_items WHERE order_id = '$order_id'";
  $result_items = $conn -> query($sql_items);

  $items =[];
  while($item = $result_items-> fetch_assoc()){

  $items[] =$item;
  }

  //menempel daftar barang ke pesanan 
  $row['daftar_barang'] = $items;
  $order[]=  $row;
}
$data['orders'] = $order;

//mengambil semua data order untuk ditampilkan di dashboard admin
  $sql = "SELECT COUNT(*) as total FROM orders";
 $stmt = $conn->prepare($sql);
  $stmt->execute();
  $result = $stmt->get_result();
  $total_orders = $result->fetch_assoc();
  $data['total_orders'] = $total_orders;

echo json_encode($data);
$conn->close();
?>