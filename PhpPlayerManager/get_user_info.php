<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (!isset($_SESSION['username'])) {
	http_response_code(403); // Forbidden
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

if (empty($_SESSION['logged_in'])) {
    http_response_code(403); // Forbidden
    echo json_encode(["error" => "User not logged in."]);
    exit();
}

$username = $_SESSION['username'];
$dir = 'players/' . $username . '/info.txt';

if (file_exists($dir)) {
    $info = file_get_contents($dir);

	preg_match('/SoundFontEditing: (.*)/', $info, $soundfontpermission);
	$soundfont = isset($soundfontpermission[1]) ? trim($soundfontpermission[1]) : null;

    preg_match('/Email: (.*)/', $info, $emailMatches);

    $email = isset($emailMatches[1]) ? trim($emailMatches[1]) : '';
    echo json_encode(['username' => $username, 'email' => $email, 'soundfontpermission' => $soundfont]);
} else {
    echo json_encode(['error' => 'Username not found']);
}
?>
