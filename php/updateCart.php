<?php 


$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'];
$action = $data['action'];

// Koneksi database
$conn = new mysqli("localhost", "root", "", "dari_kebun");

if($action === 'plus'){
  // tambah quantity +1
  $sql = "UPDATE cart SET quantity = quantity + 1 WHERE id='$id'";
  $conn->query($sql);

}else{
   $sql = "UPDATE cart SET quantity = quantity - 1 WHERE id='$id'";
  $conn->query($sql);

}

// ambil qty terbaru
$result = $conn->query("SELECT quantity FROM cart WHERE id='$id'");
$row = $result->fetch_assoc();

//hapus jika quantity sama dengan nol

if($row['quantity'] == 0){
  $sql = "DELETE FROM cart WHERE id='$id'";
  $conn->query($sql);
}
echo json_encode([
  $row['quantity']
]);


?>