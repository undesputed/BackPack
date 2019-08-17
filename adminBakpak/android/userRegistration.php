<?php
	require_once 'DBModel.php';

	$user = new DBModel();
	$response = array();
	$flag = true;
	if($_SERVER['REQUEST_METHOD']  == 'POST')
	{
		if(isset($_POST['fname'])&&isset($_POST['lname'])&&isset($_POST['username'])&&isset($_POST['addr'])&&isset($_POST['contact'])&&isset($_POST['password']))
		{
			$birth = "";
			$postal_code = "";
			$email = "";
			if($user->getUserByUsername($_POST['username']))
			{
				$response['error'] = true;
				$response['message'] = "User Exists";
				$flag = false;
			}
			if($flag)
			{	
				if($_POST['fname'] == "" && $_POST['lname'] == "" && $_POST['username'] == "" && $_POST['addr'] == "" && $_POST['contact'] == "" $_POST['password'] == "")
				{
					if($user->registerUser($_POST['fname'],$_POST['lname'],$_POST['addr'],$birth,$postal_code,$email,$_POST['contact'],$_POST['username'],$_POST['password']))
					{
						$response['error'] = false;
						$response['message'] = "Registration Success";
					}
					else
					{
						$response['error'] = true;
						$response['message'] = "Some error occured Please Try again";
					}
				}
				else
				{
					$response['error'] = true;
					$response['message'] = "Missing Fields Required";
				}
			}
			else
			{
				$response['error'] = true;
				$response['message'] = "User Exists";
			}
		}
		else
		{
			$response['error'] = true;
			$response['message'] = "Missing Fields Required";
		}
	}
	else
	{
		$response['error'] = true;
		$response['message'] = "Invalid Request Method";
	}

	echo json_encode($response);