<?php
	$servername = "104.236.200.134";
	$d_username = "buddy";
	$d_password = "";
	$db_name = "studybuddyplus";

	// Establishing Connection with Server by passing server_name, user_id and password as a parameter
	$connection = mysql_connect("$servername", "$d_username", "$d_password");

	// Selecting Database
	$db = mysql_select_db("$db_name", $connection);
	session_start();// Starting Session

	// Storing Session
	$user_check=$_SESSION['login_user'];
	// SQL Query To Fetch Complete Information Of User
	$ses_sql=mysql_query("select username from login where username='$user_check'", $connection);
	$row = mysql_fetch_assoc($ses_sql);
	$login_session =$row['username'];
	if(!isset($login_session)){
		mysql_close($connection); // Closing Connection
		header('Location: index.html'); // Redirecting To Home Page
	}
?>