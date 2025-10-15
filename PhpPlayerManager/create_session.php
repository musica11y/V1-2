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
    $sessionFilename = isset($_POST['sessionFilename']) ? $_POST['sessionFilename'] : '';

    if (empty($sessionFilename)) {
        echo "Error: Filename is required.";
        exit;
    }

    $dir = 'players/' . $username . '/sessions';

    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }

    $filePath = $dir . '/' . $sessionFilename . '.txt';

    if (file_exists($filePath)) {
        echo "Error: A file with this name already exists.";
    } else {
        file_put_contents($filePath, "");
        echo "Success: Session file created.";
    }
} else {
    echo "No input file specified.";
}
?>
