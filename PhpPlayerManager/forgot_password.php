<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

function generateRandomPassword($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomPassword = '';
    for ($i = 0; $i < $length; $i++) {
        $randomPassword .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomPassword;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = isset($_POST['username']) ? $_POST['username'] : '';

    if (empty($username)) {
        echo "Username is required.";
        exit;
    }

    $dir = 'players/' . $username . '/info.txt';

    if (file_exists($dir)) {
        $info = file_get_contents($dir);
        preg_match('/Email: (.*)/', $info, $emailMatches);
        
        if (!empty($emailMatches)) {
            $email = trim($emailMatches[1]);
            $newPassword = generateRandomPassword();
            $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);
//no-reply@musica11y.net
//Server
//ServerSide2025
//mcp.musica11y.net

			$result=preg_match('/New Password: (.*)/', $info, $newPasswordMatches);
			if($result==1)
			{
				$info = preg_replace('/New Password: .*\\n?/', '', $info);
			}

            // Append the new hashed password to the info file
            file_put_contents($dir, $info . "\nNew Password: $hashedNewPassword");

            // Email the new password to the user's email address
            $to = $email;
            $subject = "Your New Password";
            $message = "Your new password is: $newPassword";
            $headers = "From: no-reply@musica11y.net";

            if (mail($to, $subject, $message, $headers)) {
                echo "Success: A new password has been sent to your email address.";
            } else {
                echo "Error: Failed to send email.";
            }
        } else {
            echo "Error: Email address not found.";
        }
    } else {
        echo "Error: Username not found.";
    }
} else {
    echo "No input file specified.";
}
?>
