<?php
require_once '../DBConn/DbOperation.php';
$response = array();
$flag = true;
	if($_SERVER['REQUEST_METHOD']=='POST')
	{
		if(isset($_POST['username']) && isset($_POST['password']) && isset($_POST['email'])){
			$db = new DbOperation();
			$get = $db->getAllUser();
			foreach($get as $g){
				if(strtoUpper($g['username']) == trim(strtoUpper($_POST['username'])) && strtoUpper($g['email']) == strtoUpper($_POST['email']))
				{
					$response['error'] = true;
					$response['message'] = "User Exists";
					$flag = false;
				}
			}
			if($flag && ($_POST['username'] != "" && $_POST['password'] != "" && $_POST['email'] != ""))
			{
				if($db->createUser($_POST['username'], $_POST['password'], $_POST['email']))
				{
					$response['error'] = false;
					$response['message'] = "User Register Successfully";
				}
				else
				{
					$response['error'] = false;
					$response['message'] = "Some Error occured Please try again";
				}
			}
			else
			{
				$response['error'] = false;
				$response['message'] = "Already Exists";
			}
		}
		else
		{
			$response['error'] = true;
			$response['message'] = "Required Fields are missing";
		}
	}
	else{
		$response['error'] = true;
		$response['message'] = "Invalid Request";
	}

	echo json_encode($response);
