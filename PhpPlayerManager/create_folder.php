<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (!isset($_SESSION['username'])) {
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

if (empty($_SESSION['logged_in'])) {
    http_response_code(403); // Forbidden
    echo json_encode(["error" => "User not logged in."]);
    exit();
}

$username = $_SESSION['username'];
$dir = '../SoundFonts/';// . $username . '/sessions';
$soundfontpermission = isset($_SESSION['soundfontpermission']) ? trim($_SESSION['soundfontpermission']) : '';

if($soundfontpermission==="Yes")
{
			$input = json_decode(file_get_contents('php://input'), true);
			$folderName = isset($input['folder']) ? trim($input['folder']) : '';

			$basePath = '../SoundFonts/';
			$targetPath = $basePath . $folderName;

			if ($folderName === '') {
				echo json_encode(['success' => false, 'error' => 'Folder name is required.']);
				exit;
			}

			if (!preg_match('/^[a-zA-Z0-9_\- ]+$/', $folderName)) {
				echo json_encode(['success' => false, 'error' => 'Invalid folder name.']);
				exit;
			}

			if (file_exists($targetPath)) {
				echo json_encode(['success' => false, 'error' => 'Folder already exists.']);
				exit;
			}

			if (mkdir($targetPath, 0755, true)) {
				echo json_encode(['success' => true]);
			} else {
				echo json_encode(['success' => false, 'error' => 'Failed to create folder.']);
			}

}
else
{
	//echo json_encode(["error"=>"User lacks permission to edit sound fonts"]);
	echo json_encode([
    "error" => "User lacks permission to edit sound fonts",
    "soundfontpermission" => $soundfontpermission
]);

}
?>
