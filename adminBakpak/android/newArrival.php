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
$user = $obj['user'];
$pass = $obj['pass'];

$CheckSQL = "SELECT * FROM user WHERE user_username='$user' AND user_password='$pass'";
$check = mysqli_fetch_array(mysqli_query($con,$CheckSQL));
 
 
if(isset($check)){
	$getUser = "SELECT user_id FROM user WHERE user_username='$user'";
	$get= mysqli_fetch_array(mysqli_query($con,$getUser));

	$EmailExistMSG = 'Login Successfull';
	// $EmailExistJson = json_encode($get);
	$user_id = $get['user_id'];
	echo json_encode($user_id);
	// echo $EmailExistJson; 
 }else{
 	$message = 'Try Again';
 	$messageJson = json_encode($message);
 	echo $messageJson;
 }
 mysqli_close($con);
?>