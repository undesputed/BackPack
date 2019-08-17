<?php
	require_once 'DBModel.php';

	$model = new DBModel();
	$response = array();

	if($_SERVER['REQUEST_METHOD'] == 'POST')
	{
		if(isset($_POST['username'])&&isset($_POST['password']))
		{
			// $response['error'] = false;
			$ok = $model->login($_POST['username'],$_POST['password']);
			$user = $model->getAllUser();
			if($ok)
			{
				$g = $model->getUserByUsername($_POST['username']);
				// foreach($user as $g){
					if($g['user_username'] == $_POST['username'])
					{
						$response['error'] = false;
						$response['id'] = $g['user_id'];
						$response['fullname'] = $g['user_fname'].' '.$g['user_lname'];
						$response['address'] = $g['user_address'];
						$response['postal_code'] =  $g['user_postal_code'];
						$response['email'] = $g['user_email'];
						$response['phone'] = $g['user_phone'];	
						$response['username'] = $g['user_username'];
						$response['password'] = $g['user_password'];
						$response['message'] = "Login Success";											
					}
				// }
			}
			else
			{
				$response['error'] = true;
				$response['message'] = "Login Failed";
			}
		}
		else
		{
			$response['error'] = true;
			$response['message'] = "Missing Fields Required";
		}
	}
	else{
		$response["error"] = true;
		$response["message"] = "Invalid Request";
	}

	echo json_encode($response);