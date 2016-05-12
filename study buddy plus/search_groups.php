<?php
	$servername = "104.236.200.134";
	$d_username = "buddy";
	$d_password = "";
	$db_name = "studybuddyplus";
	if (isset($_POST['submit'])) {
	// Establishing Connection with Server by passing servername, d_username and d_password as a parameter
	$connection = mysql_connect("$servername", "$d_username", "$d_password");
	$name = $_POST['name'];
	// Selecting Database
	$db = mysql_select_db("$db_name", $connection);
	//$query = mysql_query("SELECT * FROM login WHERE username='$username'", $connection);
	$sql="SELECT name, courseNum, descr FROM groups WHERE 
		name LIKE '%" . $name . "%' OR courseNum LIKE '%" . $name . "%' OR descr LIKE '%" . $name . "%'";
	$query = mysql_query($sql,$connection);
	//$query = mysql_fetch_assoc($query);
	while($row = mysql_fetch_array($query)) {
		$name = $row['name'];
		$coursenum = $row['courseNum'];
		$descr = $row['descr'];
		
		echo "<p>$name $coursenum $descr</p>";
	}
	
	
mysql_close($connection); // Closing Connection	
	}
?>

<html> 
  <head> 
    <meta  http-equiv="Content-Type" content="text/html;  charset=iso-8859-1"> 
    <title>Search  Contacts</title> 
  </head> 
  <p><body> 
    <h3>Search  Contacts Details</h3> 
    <p>You  may search either by first or last name</p> 
    <form  method="post" action=""> 
      <input  type="text" name="name"> 
      <input  type="submit" name="submit" value="submit"> 
    </form> 
  </body> 
</html> 