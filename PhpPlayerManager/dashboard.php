<?php
session_start(); // Start the session

// Check if the user is logged in
if (empty($_SESSION['logged_in'])) {
	http_response_code(403); // Forbidden
    header("Location: login.html"); // Redirect if not logged in
    exit();
}


// Prevent browser caching
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Protected content
//echo "Welcome to the dashboard!";
$username = htmlspecialchars($_SESSION['username'] ?? 'Unknown User');
$email = htmlspecialchars($_SESSION['email'] ?? 'No email provided');
?>
