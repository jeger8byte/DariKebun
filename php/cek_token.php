<?php

// Load semua file manual
require_once '../libs/jwt/JWT.php';
require_once '../libs/jwt/Key.php';
require_once '../libs/jwt/JWTExceptionWithPayloadInterface.php';
require_once '../libs/jwt/ExpiredException.php';
require_once '../libs/jwt/SignatureInvalidException.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;


function validasiToken($secret_key) {
    // 1. Ambil Token dari $_COOKIE, bukan dari Header
    $token = $_COOKIE['user_token'] ?? '';

    if (!$token) {
        http_response_code(401);
        echo json_encode(["status" => "error"]);
        exit;
    }

    try {
        // 2. Decode
        $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
        return $decoded;
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["status" => "error"]);
        exit;
    }
}

?>