<?php
	require_once 'DBConnect.php';
	class DbOperation extends DBConnect{

		// private $table = 'users';
		// private $fields = array('username','password','email');

		// function __construct(){
		// 	require_once dirname(__FILE__).'/DBConnect.php';

		// 	$db = new DBConnect();

		// 	$this->con = $db->connect();
		// }

		function __contruct(){
			return DBConnect::__construct();
		}

		function createUser($username,$password){
			return DBConnect::insertRecord($username,$password,$email);
		}

		function getAllUser(){
			return DBConnect::getAllRecord();
		}

		function login($username, $password)
		{
			return DBConnect::logginUser($username,$password);
		}

		function getUsername($username)
		{
			return DBConnect::getUserByUsername($username);
		}

		function getApplicants()
		{
			return DBConnect::getAllApplicant();
		}
	}