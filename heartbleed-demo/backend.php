<?php
session_start();
header('Content-Type: application/json');

$user_file = '/tmp/users.json';
$token_file = '/tmp/reset_tokens.json';

// Load or initialize users
if (!file_exists($user_file)) {
    $default_users = array(
        'raj'   => array('password' => sha1('raj@123'), 'balance' => 5000),
        'rahul' => array('password' => sha1('rahul@123'), 'balance' => 3000),
        'iman'  => array('password' => sha1('iman@123'), 'balance' => 1000),
        'arun'  => array('password' => sha1('arun@123'), 'balance' => 2000),
        'admin' => array('password' => sha1('admin@123'), 'balance' => 12345, 'role' => 'admin')
    );
    file_put_contents($user_file, json_encode($default_users));
}
$users = json_decode(file_get_contents($user_file), true);

// Load reset tokens
if (!file_exists($token_file)) {
    file_put_contents($token_file, json_encode(array()));
}
$reset_tokens = json_decode(file_get_contents($token_file), true);
if (!is_array($reset_tokens)) $reset_tokens = array();

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');

// ------------------- LOGIN -------------------
if ($action === 'login') {
    $username = isset($_POST['username']) ? $_POST['username'] : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    if (isset($users[$username]) && sha1($password) === $users[$username]['password']) {
        $_SESSION['username'] = $username;
        $_SESSION['role'] = isset($users[$username]['role']) ? $users[$username]['role'] : 'user';
        echo json_encode(array('success' => true, 'message' => 'Login successful', 'username' => $username, 'role' => $_SESSION['role']));
    } else {
        echo json_encode(array('success' => false, 'message' => 'Invalid credentials'));
    }
    exit;
}

// ------------------- GET BALANCE (any user) -------------------
if ($action === 'get_balance') {
    if (!isset($_SESSION['username'])) {
        echo json_encode(array('success' => false, 'message' => 'Not logged in'));
        exit;
    }
    $username = $_SESSION['username'];
    $balance = isset($users[$username]['balance']) ? $users[$username]['balance'] : 0;
    echo json_encode(array('success' => true, 'balance' => $balance));
    exit;
}

// ------------------- FORGOT PASSWORD (simulate email) -------------------
if ($action === 'forgot_password') {
    $username = isset($_POST['username']) ? $_POST['username'] : '';
    if (isset($users[$username])) {
        $token = bin2hex(openssl_random_pseudo_bytes(32));
        $reset_tokens[$token] = $username;
        file_put_contents($token_file, json_encode($reset_tokens));
        // Simulate sending email (print to error log for demo)
        error_log("Password reset link for $username: https://localhost/reset.html?token=$token");

        // Seed token into Flask memory blob so it appears in Layer 1 heap dump
        // host.docker.internal resolves to the Windows host from inside Docker
        $flask_payload = json_encode(array('reset_token' => $token, 'username' => $username));
        $ch = curl_init('http://host.docker.internal:5000/api/seed-token');
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $flask_payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_TIMEOUT, 2);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        curl_close($ch);

        echo json_encode(array('success' => true, 'message' => 'Reset link sent to registered email (simulated)'));
    } else {
        echo json_encode(array('success' => false, 'message' => 'User not found'));
    }
    exit;
}

// ------------------- RESET PASSWORD (using token) -------------------
if ($action === 'reset_password') {
    $token = isset($_POST['token']) ? $_POST['token'] : '';
    $new_password = isset($_POST['new_password']) ? $_POST['new_password'] : '';
    if (isset($reset_tokens[$token])) {
        $username = $reset_tokens[$token];
        $users[$username]['password'] = sha1($new_password);
        file_put_contents($user_file, json_encode($users));
        unset($reset_tokens[$token]);
        file_put_contents($token_file, json_encode($reset_tokens));
        echo json_encode(array('success' => true, 'message' => 'Password reset successful'));
    } else {
        echo json_encode(array('success' => false, 'message' => 'Invalid or expired token'));
    }
    exit;
}

// ------------------- ADMIN: ADD FUNDS TO ANY USER -------------------
if ($action === 'add_funds') {
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        echo json_encode(array('success' => false, 'message' => 'Unauthorized'));
        exit;
    }
    $target = isset($_POST['target']) ? $_POST['target'] : '';
    $amount = isset($_POST['amount']) ? (int)$_POST['amount'] : 0;
    if (!isset($users[$target])) {
        echo json_encode(array('success' => false, 'message' => 'User not found'));
        exit;
    }
    $users[$target]['balance'] += $amount;
    file_put_contents($user_file, json_encode($users));
    echo json_encode(array('success' => true, 'new_balance' => $users[$target]['balance']));
    exit;
}

// ------------------- ADMIN: DELETE USER -------------------
if ($action === 'delete_user') {
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        echo json_encode(array('success' => false, 'message' => 'Unauthorized'));
        exit;
    }
    $target = isset($_POST['target']) ? $_POST['target'] : '';
    if ($target === 'admin') {
        echo json_encode(array('success' => false, 'message' => 'Cannot delete admin'));
        exit;
    }
    if (!isset($users[$target])) {
        echo json_encode(array('success' => false, 'message' => 'User not found'));
        exit;
    }
    unset($users[$target]);
    file_put_contents($user_file, json_encode($users));
    echo json_encode(array('success' => true, 'message' => 'User deleted'));
    exit;
}

// ------------------- LIST ALL USERS (for admin panel) -------------------
if ($action === 'list_users') {
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        echo json_encode(array('success' => false, 'message' => 'Unauthorized'));
        exit;
    }
    $user_list = array();
    foreach ($users as $name => $data) {
        $user_list[] = array('username' => $name, 'balance' => $data['balance']);
    }
    echo json_encode(array('success' => true, 'users' => $user_list));
    exit;
}

// ------------------- HEARTBLEED TOKEN DUMP (for simulation) -------------------
if ($action === 'get_reset_tokens') {
    echo json_encode(array('tokens' => array_keys($reset_tokens)));
    exit;
}

http_response_code(404);
echo json_encode(array('error' => 'Invalid action'));
?>
