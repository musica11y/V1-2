<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_SESSION['username'])) {
        echo "Error: Not logged in.";
        exit;
    }

if (empty($_SESSION['logged_in'])) {
    http_response_code(403); // Forbidden
    echo json_encode(["error" => "User not logged in."]);
    exit();
}

    $username = $_SESSION['username'];
    $newPassword = isset($_POST['newPassword']) ? $_POST['newPassword'] : '';
    $newEmail = isset($_POST['newEmail']) ? $_POST['newEmail'] : '';
    $dir = 'players/' . $username . '/info.txt';

    if (file_exists($dir)) {
        $info = file_get_contents($dir);

        if (!empty($newPassword)) {
            $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            $info = preg_replace('/Password: .*\\n?/', '', $info);
            $info .= "Password: $hashedNewPassword\n";
        }

        if (!empty($newEmail)) {
            $info = preg_replace('/Email: .*\\n?/', "Email: $newEmail\n", $info);
        }

        file_put_contents($dir, $info);
        echo "Success: Information updated.";
    } else {
        echo "Error: Username not found.";
    }
} else {
    echo "No input file specified.";
}
?>
