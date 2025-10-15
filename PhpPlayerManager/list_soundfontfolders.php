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

$sessions = [];

function listSf2Files($directory, &$sessions, $baseDirLength) {
    if (!is_dir($directory)) return;

    $items = scandir($directory);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;

        $path = $directory . DIRECTORY_SEPARATOR . $item;
        if (is_dir($path)) {
        //    listSf2Files($path, $sessions, $baseDirLength); // Recurse into subfolders
        //} elseif (is_file($path) && strtolower(pathinfo($path, PATHINFO_EXTENSION)) === 'sf2') {
         //   $sessions[] = realpath($path); // Store the full file path
			//$relative = substr($path, $baseDirLength);
           // $relative = ltrim(str_replace('\\', '/', $relative), '/');
          //  $sessions[] = $path;
				
				$relative = substr($path, $baseDirLength);
				$relative = ltrim(str_replace('\\', '/', $relative), '/');
				$sessions[] = $relative; 
        }
    }
}

if($soundfontpermission==="Yes")
{
	//if (is_dir($dir)) {
		//$files = scandir($dir);
		//foreach ($files as $file) {
	//		if ($file !== '.' && $file !== '..') {
		//		$sessions[] = $file;
			//}
		//}
		    
	//}
	 $baseDirLength = strlen($dir) + 1; // +1 to skip trailing slash

	 listSf2Files($dir, $sessions,$baseDirLength);
	echo json_encode(['sessions' => $sessions]);
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
