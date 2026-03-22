<?php
   require_once 'cek_token.php';
  //cek token 
  $secret = "RAHASIA_DARI_KEBUN_99_PASTI_AMAN"; 
  $userData = validasiToken($secret);
  $user_id = $userData-> uid;
  
$conn = new mysqli ("localhost","root","","dari_kebun");
// ambil semua pesanan
$sql_orders = "SELECT * FROM orders WHERE user_id ='$user_id'";
$result = $conn->query($sql_orders);
$data = [];


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
  $data[] = $row;

}


echo json_encode($data);

?>