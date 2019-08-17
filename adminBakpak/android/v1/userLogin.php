<?php

	require_once '../DBConn/DbOperation.php';

	$response = array();
	if($_SERVER['REQUEST_METHOD']=='POST')
	{
		if(isset($_POST['username']) && isset($_POST['password']))
		{
			$db = new DbOperation();
			$get = $db->getAllUser();
			$ok = $db->login($_POST['username'], $_POST['password']);
			if($ok)
			{					
				$response['error'] = false;
				$response['message'] = "Login Success";
				$response['id'] = $g['user_id'];
				$response['name'] = $g['user_fname'].' '.$g['user_lname'];
				$response['username'] = $g['user_username'];
			}
			else
			{
				$response['error'] = true;
				$response['message'] = "ERROR";
			}
		}
	}
	else
	{
		$response['error'] = true;
		$response['message']="Invalid Request";
	}

	echo json_encode($response);