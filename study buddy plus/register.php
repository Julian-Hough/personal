<?php
	$servername = "104.236.200.134";
	$d_username = "buddy";
	$d_password = "";
	$db_name = "studybuddyplus";

	$error=''; // Variable To Store Error Message
	if (isset($_POST['submit'])) {
		if (strlen($_POST['password']) < 8){
			$error = "<p class='alert alert-danger'>Password length has to be 8 characters or more</p>";
		}else if (substr($_POST['email'],-4) != '.edu') {
			$error = "<p class='alert alert-danger'>Email must be .edu</p>";
		}else if($_POST['password'] !== $_POST['password2']){
			$error = "<p class='alert alert-danger'>Passwords do not match</p>";
		}else {
			// Define $username and $password
			$username = $_POST['username'];
			$password = $_POST['password'];
			$firstname = $_POST['firstname'];
			$lastname = $_POST['lastname'];
			$email = $_POST['email'];
			$salt = hash('sha256', mcrypt_create_iv(22, MCRYPT_DEV_URANDOM));

			//password hashing
			$password = hash('sha256', $salt . $password);

			// Establishing Connection with Server by passing servername, d_username and d_password as a parameter
			$connection = mysql_connect("$servername", "$d_username", "$d_password") or die(mysql_error());

			// Selecting Database
			$db = mysql_select_db("$db_name", $connection);
			$query = mysql_query("SELECT * FROM login WHERE username='$username'", $connection);

			if (mysql_num_rows($query) == 1) {
				$error = "<p class='alert alert-warning'>This username is already in use :(</p>";
			}else {
				// SQL query to insert information of user.
				$query = mysql_query("INSERT INTO `login`(`username`,`password`,`salt`,`firstname`,`lastname`,`email`)
									VALUES('$username','$password','$salt','$firstname','$lastname','$email') ", $connection);
				$error = "<p class='alert alert-success'>You have registered successfully!</p>";
				header('Location: loginpage.php'); // Redirecting To login page	

			}
			mysql_close($connection); // Closing Connection				
		}
	}

?>