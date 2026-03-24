<?php
// logout.php

// 1. Timpa cookie JWT dengan nilai kosong dan waktu kadaluarsa -1 jam
setcookie("user_token", $jwt, [
    'expires' => time() - 3600,
    'path' => '/',
    'httponly' => true,
    'secure' => true,
    'samesite' => 'Lax'
]);


// 3. Arahkan kembali ke halaman login
echo json_encode( ['status' => 'success']);
exit;