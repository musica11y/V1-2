<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = isset($_POST['username']) ? $_POST['username'] : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    $email = isset($_POST['email']) ? $_POST['email'] : '';

    if (empty($username) || empty($password) || empty($email)) {
        echo "Username, password, and email are required.";
        exit;
    }

    $dir = 'players/' . $username;

    if (is_dir($dir)) {
        echo "Error: The username already exists.";
    } else {
        if (mkdir($dir, 0777, true)) {
            // Hash the password
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Create and write to the info file
            $infoFile = fopen($dir . '/info.txt', 'w');
            if ($infoFile) {
                fwrite($infoFile, "Username: $username\n");
                fwrite($infoFile, "Email: $email\n");
                fwrite($infoFile, "Password: $hashedPassword\n");
                fclose($infoFile);
                echo "Success: Player created. Info file created at " . realpath($dir . '/info.txt');
            } else {
                echo "Error: Could not create info file.";
            }
        } else {
            echo "Error: Could not create directory.";
        }
    }
} else {
    echo "No input file specified.";
}
?>

