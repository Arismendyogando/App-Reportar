<?php
$secret = "tu_token_secreto";
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE'];

if($signature) {
    $hash = "sha1=" . hash_hmac('sha1', file_get_contents("php://input"), $secret);
    if(hash_equals($hash, $signature)) {
        shell_exec('cd /home/user/appreportar && git pull origin main 2>&1');
        echo "¡Despliegue exitoso!";
    }
}
?>
