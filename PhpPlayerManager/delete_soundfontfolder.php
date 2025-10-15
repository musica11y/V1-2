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

function deleteFolderAndContents($folderPath) {	
    if (!is_dir($folderPath)) return false;

    $items = scandir($folderPath);
	
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;

       $path = $folderPath . DIRECTORY_SEPARATOR . $item;
	  // if (!is_dir($folderPath)) {
		//	echo "Error: Invalid folder path:".$folderPath;
		//	exit;
	//	}
   if (is_dir($path)) {
         deleteFolderAndContents($path); // Recurse into subfolders
      } else {
            unlink($path); // Delete file
        }
    }

    return rmdir($folderPath); // Delete empty folder
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

    if (is_dir($filePath)) {
	  deleteFolderAndContents($filePath);
        echo "Success: Soundfont folder deleted: ".$filePath;
    } else {
        echo "Error: Folder not found:".$filePath;
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
