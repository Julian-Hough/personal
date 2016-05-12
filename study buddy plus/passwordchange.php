<?php
	$servername = "104.236.200.134";
	$d_username = "buddy";
	$d_password = "";
	$db_name = "studybuddyplus";

	$error=''; // Variable To Store Error Message
	if (isset($_POST['submit'])) {
		if (strlen($_POST['password']) < 8){
			$error = "<p class='alert alert-danger'>Password length has to be 8 characters or more</p>";
		}else if($_POST['password'] != $_POST['password2']){
			$error = "<p class='alert alert-danger'>Passwords do not match</p>";
		}else {
			// Define $old_password and $password
			$username = $_SESSION['login_user'];
			$old_password = $_POST['old_password'];
			$password = $_POST['password'];
			$salt = hash('sha256', mcrypt_create_iv(22, MCRYPT_DEV_URANDOM));

			//password hashing
			$password = hash('sha256', $salt . $password);

			// Establishing Connection with Server by passing servername, d_username and d_password as a parameter
			$connection = mysql_connect("$servername", "$d_username", "$d_password");

			// Selecting Database
			$db = mysql_select_db("$db_name", $connection);
			$query = mysql_query("SELECT password, salt FROM login WHERE username='$username'", $connection);
			$query = mysql_fetch_assoc($query);
			$old_salt = $query["salt"];
			$query = $query["password"];
			
			$old_password = hash('sha256', $old_salt . $old_password);
			
			if ($old_password != $query) {
				$error = "<p class='alert alert-warning'>Wrong Old Password</p>";
			}else {
				
				$query = mysql_query("UPDATE login SET password='$password', salt='$salt' WHERE username='$username' ", $connection);
				
				$error = "<p class='alert alert-success'>Your password has been changed!</p>";
				
			}
			
			mysql_close($connection); // Closing Connection				
		}
	}

?>