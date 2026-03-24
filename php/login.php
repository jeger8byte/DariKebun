<?php

require_once '../libs/jwt/JWT.php';
require_once '../libs/jwt/Key.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$conn = new mysqli("localhost", "root", "", "dari_kebun");
$secret_key = "RAHASIA_DARI_KEBUN_99_PASTI_AMAN"; 

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // 1. Cari user berdasarkan email
    $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    

    // 2. Verifikasi Password
    if ($user && password_verify($password, $user['password'])) {
        
        // 3. Buat isi (payload) JWT
        $payload = [
           
            "uid" => $user['id'],      // ID User dari database
            "name" => $user['username'],
           
        ];

        // 4. Generate Token
        $jwt = JWT::encode($payload, $secret_key, 'HS256');

        // 5. Simpan di HttpOnly Cookie
        setcookie("user_token", $jwt, [
          
            'path' => '/',
            'domain' => '',        // Kosongkan untuk localhost
            'secure' => false,     // Ubah ke true jika sudah menggunakan HTTPS
            'httponly' => true,    // Proteksi ekstra: JS tidak bisa membaca cookie ini
            'samesite' => 'Lax'    // Proteksi dari serangan CSRF
        ]);

        // Kirimkan token ke browser (untuk disimpan di localStorage)
        echo json_encode([
            "status" => "success",
            "message" => "Login berhasil!"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Email atau password salah!"
        ]);
    }
}
?>