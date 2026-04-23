<?php 


$data = json_decode(file_get_contents('php://input'), true);

$product_id = $data['productId'];
$action = $data['action'];

// Koneksi database

$conn = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);

if($action === 'plus'){
  // tambah quantity +1
  $sql = "UPDATE cart SET quantity = quantity + 1 WHERE product_id='$product_id'";
  $conn->query($sql);

}else if($action === 'minus'){
   $sql = "UPDATE cart SET quantity = quantity - 1 WHERE product_id='$product_id'";
  $conn->query($sql);

}else{
  $sql = "UPDATE cart SET quantity = 0 WHERE product_id='$product_id'";
  $conn->query($sql);
}

// ambil qty terbaru
$result = $conn->query("SELECT quantity FROM cart WHERE product_id='$product_id'");
$row = $result->fetch_assoc();

//hapus jika quantity sama dengan nol

if($row['quantity'] == 0){
  $sql = "DELETE FROM cart WHERE product_id='$product_id'";
  $conn->query($sql);
}
echo json_encode([
  $row['quantity']
]);


?>