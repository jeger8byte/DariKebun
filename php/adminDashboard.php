<?php

require_once 'cek_token.php';
require_once  '../config/env.php';
loadEnv(__DIR__ . '/../.env');
//cek token 
$secret = $_ENV['JWT_SECRET'];
$userData = validasiToken($secret);

$conn = new mysqli("localhost","root","","dari_kebun");


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = json_decode(file_get_contents('php://input'), true);
    $productId = $input['id'] ?? null;

    if(!$productId){
        echo json_encode([
            "status" => "error",
            "message" => "ID tidak valid"
        ]);
        exit;
    }

    // ambil data gambar dulu dari database
    $sql = "SELECT image FROM produk WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();

    if (!$data) {
        echo json_encode([
            "status" => "error",
            "message" => "Produk tidak ditemukan"
        ]);
        exit;
    }
     $imagePath = "../" . $data['image']; 
    //  hapus file gambar kalau ada
    if (file_exists($imagePath)) {
        unlink($imagePath);
    }




    //hapus produk dari database
    $sql_delete = "DELETE FROM produk WHERE id = ?";
    $stmt = $conn->prepare($sql_delete);
    $stmt->bind_param("i", $productId);

    if($stmt->execute()){
        echo json_encode([
            "status" => "success",
            "message" => "Produk berhasil dihapus"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Gagal menghapus produk"
        ]);
    }

    $stmt->close();
    $conn->close();
    exit; 
}


$data = [];

// total produk
$sql_total_product = "SELECT COUNT(*) as total FROM produk";
$stmt = $conn->prepare($sql_total_product);
$stmt->execute();
$result = $stmt->get_result();
$product_row = $result->fetch_assoc();
$data['total_products'] = $product_row['total'];

// total orders
$sql_total_order = "SELECT COUNT(*) as total FROM orders";
$stmt = $conn->prepare($sql_total_order);
$stmt->execute();
$result = $stmt->get_result();
$order_row = $result->fetch_assoc();
$data['total_orders'] = $order_row['total'];


// total customers
$sql_total_customers = "SELECT COUNT(*) as total FROM users";
$stmt = $conn->prepare($sql_total_customers);
$stmt->execute();
$result = $stmt->get_result();
$customer_row = $result->fetch_assoc();
$data['total_customers'] = $customer_row['total'];

//total revenue
$sql_total_revenue = "SELECT SUM(total_harga) as total FROM orders";
$stmt = $conn->prepare($sql_total_revenue);
$stmt->execute();
$result = $stmt->get_result();
$revenue_row = $result->fetch_assoc();
$data['total_revenue'] = (int)$revenue_row['total']; // ubah ke integer untuk memastikan format angka benar


// mengambil semua data product
$sql_products = "SELECT * FROM produk";
$stmt = $conn->prepare($sql_products);
$stmt->execute();
$result = $stmt->get_result();
$products = [];

while($row = $result->fetch_assoc()){
    $products[] = $row;
}
$data['products'] = $products;


echo json_encode($data);

$stmt->close();
$conn->close();
?>