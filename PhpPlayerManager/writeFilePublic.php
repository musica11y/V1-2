<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $textToWrite = $data['text'];
    $originalPath = $data['filePath'];

    // Break the path into directory, filename, and extension
    $directory = dirname($originalPath);
    $filename = pathinfo($originalPath, PATHINFO_FILENAME);
    $extension = pathinfo($originalPath, PATHINFO_EXTENSION);

    $finalPath = $originalPath;
    $counter = 1;

    // Check if file exists and increment until we find a free name
    while (file_exists($finalPath)) {
        $finalPath = $directory . '/' . $filename . $counter . '.' . $extension;
        $counter++;
    }

    // Write the text to the new file
    if (file_put_contents($finalPath, $textToWrite) !== false) {
        echo 'File written successfully as: ' . basename($finalPath);
    } else {
        echo 'Error writing to file';
    }
}
?>