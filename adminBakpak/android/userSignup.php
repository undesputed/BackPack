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
$fname = $obj['fname'];
$lname = $obj['lname'];
$address = $obj['address'];
$phone = $obj['phone'];
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
	$Sql_Query = "insert into user (user_fname,user_lname,user_address,user_phone,user_username,user_password) values ('$fname','$lname','$address','$phone','$username','$password')";
 
	if(mysqli_query($con,$Sql_Query)){
		$MSG = 'User Registered Successfully' ;
		$json = json_encode($MSG);
		echo $json ;
	}
	 else{
	 
	 echo 'Try Again';
	 
	 }
 }
 mysqli_close($con);
?>