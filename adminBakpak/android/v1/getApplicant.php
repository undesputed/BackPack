<?php
	require_once '../includes/DbOperation.php';
	
	$response = array();
	$user = new DbOperation();
	foreach($user->getApplicants() as $use)
	{
		$response['id'] = $use['id'];
		$response['account_number'] = $use['account_number'];
		$response['account_name'] = $use['account_name'];
		$response['previous_reading'] = $use['previous_reading'];
		echo json_encode($response);
	}

	// echo json_encode($user->getApplicants());
?>