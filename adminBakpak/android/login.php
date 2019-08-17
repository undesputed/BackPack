<?php
	require_once 'DBModel.php';

	$model = new DBModel;
	$response = array();
	$get=array();
	if($_SERVER['REQUEST_METHOD'] == 'POST')
	{
		
		if(isset($_POST['username']) && isset($_POST['password']))
		{
			
			$get = $model->getUserByUsername($_POST['username']);
			// var_dump($get);
			if($model->login($_POST['username'], $_POST['password']))
			{
				$response['error'] = false;
				$response['id'] = $get['user_id'];
				$response['username'] =  $get['user_username'];
				$response['password'] = $get['user_password'];
				$response['message'] = "Login Success";
			}
			else
			{
				$response['error'] = true;
				$response['message'] = "Invalid Fields";
			}

		}
		else
		{
			$response['error'] = true;
			$response['message'] = "Invalid Fields";
		}
	}
	else
	{
		$response['error'] = true;
		$response['message'] = "Invalid Method";
	}

	echo json_encode($response);