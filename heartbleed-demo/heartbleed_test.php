<?php
header('Content-Type: application/json');

$token_file = '/tmp/reset_tokens.json';
$reset_tokens = array();
if (file_exists($token_file)) {
    $reset_tokens = json_decode(file_get_contents($token_file), true);
    if (!is_array($reset_tokens)) $reset_tokens = array();
}

$claimed = isset($_GET['size']) ? (int)$_GET['size'] : 64;
$actual = 64;
$overflow = max(0, $claimed - $actual);

$all_items = array(
    array("type" => "Authentication Data", "data" => "submitted username: demo_user"),
    array("type" => "Authentication Data", "data" => "password buffer (redacted)"),
    array("type" => "Session State", "data" => "session token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
);

if (!empty($reset_tokens)) {
    foreach ($reset_tokens as $token => $username) {
        $all_items[] = array("type" => "Password Reset Token", "data" => "token: $token for user: $username");
    }
}

$all_items[] = array("type" => "Service Secret", "data" => "API key: sk_test_demo_redacted_not_real");
$all_items[] = array("type" => "Database Config", "data" => "postgresql://app:redacted@db.internal:5432/bank");
$all_items[] = array("type" => "Key Material", "data" => "RSA private key fragment: -----BEGIN RSA PRIVATE KEY-----");

$items_to_expose = min(floor($overflow / 50) + 1, count($all_items));
$exposed = array_slice($all_items, 0, $items_to_expose);

echo json_encode(array(
    'claimed_size' => $claimed,
    'actual_size' => $actual,
    'exposed_bytes' => $overflow,
    'memory_exposed' => $exposed
));
?>
