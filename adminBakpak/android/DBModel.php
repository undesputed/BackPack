<?php
	require_once 'DBHelper.php';

	Class DBModel extends DBHelper
	{
		function __construct(){
			return DBHelper::__construct();
		}

		function login($username,$password)
		{
			return DBHelper::logginUser($username,$password);
		}

		function getAllUser()
		{
			return DBHelper::getAllRecord();
		}

		function getUserByUsername($username)
		{
			return DBHelper::getRecordByUsername($username);
		}

		function registerUser($fname,$lname,$addr,$bdate,$postal_code,$email,$phone,$username,$password)
		{
			return DBHelper::insertRecord($fname,$lname,$addr,$bdate,$postal_code,$email,$phone,$username,$password);
		}
	}