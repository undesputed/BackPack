<?php
 
// Importing DBConfig.php file.
include 'config.php';
$hostname = 'localhost';
$username = 'root';
$password = '';
$database = 'bakpak';
$con = mysqli_connect($hostname, $username, $password, $database);

$json = file_get_contents('php://input');

$obj = json_decode($json,true);
$username = $obj['username'];
$password = $obj['password'];

$CheckSQL = "SELECT * FROM user WHERE user_username='$username'";
$check = mysqli_fetch_array(mysqli_query($con,$CheckSQL));
 
 
if(isset($check)){
	$EmailExistMSG = 'Email Already Exist, Please Try Again !!!';
	$EmailExistJson = json_encode($EmailExistMSG);
	echo $EmailExistJson; 
 }
else{
	$getUserId = "SELECT user_id from user order by user_id desc limit 1";
	$get = mysqli_fetch_array(mysqli_query($con,$getUserId));
	$user_id = $get['user_id']+1;
	$Sql_Query = "insert into user (user_username,user_password) values ('$username','$password')";
	$Sql_Points = "insert into points (points,user_id) values(1,'$user_id')";
	// $Sql_Details = "insert into user_details(user_username,user_password,user_id) values('$username','$password','$user_id')";
 
 	if(mysqli_query($con,$Sql_Points)){
		if(mysqli_query($con,$Sql_Query)){
			$MSG = 'User Registered Successfully' ;
			$json = json_encode($MSG);
			echo $json ;
		}
		 else{
		 
		 echo 'Try Again';
		 
		 }
 	}else{
 		echo 'Try Again';
 	}
 }
 mysqli_close($con);
?>