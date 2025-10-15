<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
if (!isset($_SESSION['username'])) {
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

if (empty($_SESSION['logged_in'])) {
    http_response_code(403); // Forbidden
    echo json_encode(["error" => "User not logged in."]);
    exit();
}

  $input = json_decode(file_get_contents('php://input'), true);
$username = $_SESSION['username'];
$dir = '../SoundFonts/';// . $username . '/sessions';
$soundfontpermission = isset($_SESSION['soundfontpermission']) ? trim($_SESSION['soundfontpermission']) : '';
 $filename = isset($input['filename']) ? $input['filename'] : '';
  
if($soundfontpermission==="Yes")
{
	if (empty($filename)) {
        echo "Error: Filename is required.";
        exit;
    }

    $filePath = '../SoundFonts/' . $filename;

    if (file_exists($filePath)) {
      unlink($filePath);
        echo "Success: Soundfont file deleted: ".$filePath;
    } else {
        echo "Error: File not found:".$filePath;
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
}
?>
