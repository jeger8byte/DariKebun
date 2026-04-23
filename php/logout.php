<?php
// logout.php


setcookie("user_token", $jwt, [
   'expires'  => time() - 3600, 
    'path'     => '/',
    'domain'   => '',         
    'secure'   => false,       
    'httponly' => true,
    'samesite' => 'Lax'
]);


echo json_encode( ['status' => 'success']);
exit;

?>