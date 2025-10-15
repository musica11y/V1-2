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
    $input = json_decode(file_get_contents('php://input'), true);
    $filename = isset($input['filename']) ? $input['filename'] : '';

    if (empty($filename)) {
        echo "Error: Filename is required.";
        exit;
    }

    $filePath = 'players/' . $username . '/sessions/' . $filename;

    if (file_exists($filePath)) {
        unlink($filePath);
        echo "Success: Session file deleted.";
    } else {
        echo "Error: File not found.";
    }
} else {
    echo "No input file specified.";
}
}
?>
