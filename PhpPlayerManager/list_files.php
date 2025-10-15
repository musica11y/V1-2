<?php
// Specify the directory to list files from
$root = $_SERVER['DOCUMENT_ROOT'] . '/SoundFonts'; 
$result = [];
$folders = array_filter(glob($root . '/*'), 'is_dir');

foreach ($folders as $folderPath) {
    $folderName = basename($folderPath);
    $files = array_filter(glob($folderPath . '/*'), 'is_file');

    foreach ($files as $filePath) {
        $fileName = basename($filePath);
        $result[] = [
            'folder' => $folderName,
            'file' => $fileName
        ];
    }
}

header('Content-Type: application/json');
echo json_encode($result);

?>
