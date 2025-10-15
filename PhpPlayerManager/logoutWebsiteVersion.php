<?php
session_start();

// Clear session variables
$_SESSION = [];

// Destroy session cookie if it exists
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params['path'], $params['domain'],
        $params['secure'], $params['httponly']
    );
}


session_destroy();
//echo "Success: Logged out.";
header("Location: https://musica11y.net/index.html");
exit;

?>
