<?php
	$servername = "104.236.200.134";
	$d_username = "buddy";
	$d_password = "";
	$db_name = "studybuddyplus";


	session_start(); // Starting Session
	$error=''; // Variable To Store Error Message
	if (isset($_POST['submit'])) {
		if (empty($_POST['username']) || empty($_POST['password'])) {
			$error = "<p class='alert alert-warning'>Enter a username or password</p>";
		}else {
			// Define $username and $password
			$username=$_POST['username'];
			$password=$_POST['password'];
			// Establishing Connection with Server by passing server_name, user_id and password as a parameter
			// Using PDO and prepared statements for security purposes
			$connection = new PDO("mysql:host=$servername", $d_username, $d_password);
			$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

			// Selecting Database
			//$db = mysql_select_db("$db_name", $connection);
			$connection->exec("USE `$db_name`");
			
			//Fetching the salt for the inputted username
			$sql="SELECT `salt` FROM login WHERE username=:username";
			$stmt=$connection->prepare($sql);
			$stmt->bindParam(':username', $username);
			$stmt->execute();
			$result=$stmt->fetch();
			$salt=$result['salt'];

			$password = hash('sha256', $salt . $password);
						
			// SQL query to fetch information of registerd users and finds user match.
			//$query = mysql_query("SELECT * FROM login WHERE password='$password' AND username='$username'", $connection);
			//$rows = mysql_num_rows($query);
			$sql="SELECT COUNT(*) FROM login WHERE password=:password AND username=:username";
			$stmt=$connection->prepare($sql);
			$stmt->bindParam(':password', $password);
			$stmt->bindParam(':username', $username);
			$stmt->execute();
			$rows=$stmt->fetch();
			$rows=$rows[0];
						
			if ($rows == 1) {
				$_SESSION['login_user']=$username; // Initializing Session
				header("location: dashboard.php"); // Redirecting To Other Page
			} else {
				$error = "<p class='alert alert-danger'>Username or Password is invalid</p>";
			}
			//mysql_close($connection); // Closing Connection
			$connection = null; // Closing Connection
		}
	}
?>