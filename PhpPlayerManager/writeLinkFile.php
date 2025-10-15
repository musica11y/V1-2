<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the JSON input
    $data = json_decode(file_get_contents('php://input'), true);

    // Get the text to write and the path/filename from the JSON input
    $textToWrite = $data['text'];
    $filePath = $data['filePath'];
	$username= $data['username'];

    if (empty($username)) {
        echo "Target Username is required.";
        exit;
    }

    $dir = 'players/' . $username . '/info.txt';
	
//	echo "Error target was::";
//	echo $dir;


    if (file_exists($dir)) {
		// Write the text to the file
		if (file_put_contents($filePath, $textToWrite) !== false) {
				echo 'File Written successfully';
		} else {
				echo 'Error writing to file';
				}
		}
	else
	{
		  echo "Error: Username not found.";
	}
}
?>
