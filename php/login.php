<?php

require_once '../libs/jwt/JWT.php';
require_once '../libs/jwt/Key.php';
require_once  '../config/env.php';
loadEnv(__DIR__ . '/../.env');


    
use Firebase\JWT\JWT;
use Firebase\JWT\Key;  


$conn = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);
$secret_key =$_ENV['JWT_SECRET']; 

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // 1. Cari user berdasarkan email
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    

    // 2. Verifikasi Password
    if ($user && password_verify($password, $user['password']) && $user['role'] === 'user') {
        
        // 3. Buat isi (payload) JWT
        $payload = [
            "uid" => $user['id'],      // ID User dari database
            "name" => $user['username'],   
        ];

        // 4. Generate Token
        $jwt = JWT::encode($payload, $secret_key, 'HS256');

      
        setcookie("user_token", $jwt, [
        'expires'  => time() + (3600 * 24), 
        'path'     => '/',
        'domain'   => '', 
        'secure'   => false,
        'httponly' => true,
        'samesite' => 'Lax'
        ]);

        // Kirimkan token ke browser (untuk disimpan di localStorage)
        echo json_encode([
            "status" => "user",
            "message" => "Login berhasil!"
        ]);

    }else if ($user && password_verify($password, $user['password']) && $user['role'] === 'admin') {

         // 3. Buat isi (payload) JWT
        $payload = [
            "uid" => $user['id'],      // ID User dari database
            "name" => $user['username'],
            "role" => $user['role'] // Tambahkan role ke payload   
        ];

        // 4. Generate Token
        $jwt = JWT::encode($payload, $secret_key, 'HS256');

      
        setcookie("user_token", $jwt, [
        'expires'  => time() + (3600 * 24), 
        'path'     => '/',
        'domain'   => '', 
        'secure'   => false,
        'httponly' => true,
        'samesite' => 'Lax'
        ]);
                
       
         echo json_encode([
            "status" => "admin",
            "message" => "Login sebagai admin berhasil!"
        ]);       
           
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Email atau password salah!"
        ]);
    }
}
?>