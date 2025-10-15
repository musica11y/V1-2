<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = isset($_POST['username']) ? $_POST['username'] : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    if (empty($username) || empty($password)) {
        echo "Username and password are required.";
        exit;
    }

    $dir = 'players/' . $username . '/info.txt';

    if (file_exists($dir)) {
        $info = file_get_contents($dir);
		preg_match('/Password: (.*)/', $info, $originalPasswordMatches);
        preg_match('/New Password: (.*)/', $info, $newPasswordMatches);
      

	preg_match('/SoundFontEditing: (.*)/', $info, $soundfontpermission);
	$soundfont = isset($soundfontpermission[1]) ? trim($soundfontpermission[1]) : null;
    $_SESSION['soundfontpermission'] = $soundfont;

        $originalPassword = isset($originalPasswordMatches[1]) ? $originalPasswordMatches[1] : '';
        $newPassword = isset($newPasswordMatches[1]) ? $newPasswordMatches[1] : '';

        if (password_verify($password, $originalPassword) || password_verify($password, $newPassword)) {
            $_SESSION['username'] = $username;

            // Keep the verified password and remove the other
			if(password_verify($password, $newPassword))
			{
				$info = preg_replace('/New Password: .*\\n?/', '', $info);
				$info = preg_replace('/Password: .*\\n?/', '', $info);
                $info .= "Password: $newPassword\n";
				//$info .= ">Newpassword set\n";
			}
            else {//if (password_verify($password, $originalPassword)) {                
				$info = preg_replace('/New Password: .*\\n?/', '', $info);				
        		//$info .= ">oldpassword kept\n";
		    }
            file_put_contents($dir, $info);
			$_SESSION['logged_in'] = true;
            echo "Success: Logged in.";
        } else {
            echo "Error: invalid username or password.";
        }
    } else {
        echo "Error: Username not found.";
    }
} else {
    echo "No input file specified.";
}
?>
