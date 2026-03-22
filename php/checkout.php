<?php

 require_once 'cek_token.php';
 //cek token 
  $secret = "RAHASIA_DARI_KEBUN_99_PASTI_AMAN"; 
  $userData = validasiToken($secret);


 
  $conn =  new mysqli("localhost", "root", "", "dari_kebun");
  $data = json_decode(file_get_contents('php://input'), true);
  $cart = $data['cart'];
  $alamat = $data['alamat'];
  $penerima = $data ['penerima'];
  $user_id =  $userData-> uid;
  
  $total = 0;
  foreach($cart as $item){
    $total += $item["price"] * $item["quantity"];
  }

$sql = "INSERT INTO orders (user_id,total_harga,alamat_kirim,penerima)
        VALUES ('$user_id','$total','$alamat','$penerima')";

$conn->query($sql);


$order_id = $conn->insert_id; // mengambil id

// masukkan ke tabel order_items
foreach($cart as $item){

    $produk_id = $item["product_id"];
    $quantity = $item["quantity"];
    $harga = $item["price"];
    $image =$item["image"];
    $name = $item["name"];

    $sql = "INSERT INTO order_items (order_id,produk_id,quantity,harga,produk_image,produk_nama)
            VALUES ('$order_id','$produk_id','$quantity','$harga','$image','$name')";

    $conn->query($sql);
}

//menghapus item di tabel cart setelah klik pesan
$sql = "DELETE FROM cart WHERE user_id='$user_id'";
$conn->query($sql);


//####3
echo json_encode([
    "status" => "success",
    "order_id" => $order_id
]);


?>