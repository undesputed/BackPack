<?php
	$hostname = 'localhost';
	$username = 'root';
	$password = '';
	$database = 'bakpak';
	$con = mysqli_connect($hostname, $username, $password, $database);

	if($con->connect_error){
		die("Connection Failed: " . $conn->connect_error);
	}

	$sql = "SELECT * FROM sub_categories";

	$result = $con->query($sql);
	if($result->num_rows > 0){
		while($row[] = $result->fetch_assoc()){
			$item = $row;
			$json = json_encode($item);
		}
	} else{
		echo "No Result Found";
	} 
	echo $json;
	$con->close();
?>