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
	//$input = json_decode(file_get_contents('php://input'), true);
	//$folderName = isset($input['folder']) ? trim($input['folder']) : '';
$folderName = isset($_POST['folder']) ? trim($_POST['folder']) : '';


		if (!isset($_FILES['file'])) {
					echo json_encode(['success' => false, 'error' => 'No file uploaded.']);
					exit;
				}
		if ($folderName === '') {
				echo json_encode(['success' => false, 'error' => 'Target folder is missing.']);
				exit;
		}
			$basePath = '../SoundFonts/';
			$uploadDir = $basePath . $folderName;


			$filename = basename($_FILES['file']['name']);
			//$targetFile = $uploadDir . $filename;
			$targetFile = $uploadDir . DIRECTORY_SEPARATOR . $filename;
	
			if (file_exists($targetFile)) {
				echo json_encode(['success' => false, 'error' => 'File already exists. >>>'.$targetFile.'<<<']);
				exit;
			}

			if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
				echo json_encode(['success' => true, 'filename' => $filename]);
			} else {
				echo json_encode(['success' => false, 'error' => 'Failed to upload file.'.$targetFile]);
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
