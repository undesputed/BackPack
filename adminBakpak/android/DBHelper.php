<?php
	Class DBHelper
	{
		private $hostname = "localhost";
		private $username = "root";
		private $password = "";
		private $dbname = "bakpak";
		private $conn;

		function __construct(){
			try{
				$this->conn = new PDO("mysql:hostname=$this->hostname;dbname=$this->dbname",$this->username,$this->password);
			}catch(PDOException $e){
				echo $e->getMessage();
			}
		}

		function logginUser($username, $password)
		{
			$flag = false;
			$sql = "SELECT * FROM USER WHERE user_username = ? AND user_password = ?";
			$stmt = $this->conn->prepare($sql);
			$stmt->execute(array($username,$password));
			$row = $stmt->fetch(PDO::FETCH_ASSOC);
			if($stmt->rowCount() > 0)
			{
				$flag = true;
			}

			return $flag;
		}

		public function getAllRecord(){
			$row;
			$sql = "SELECT * FROM USER";
			try
			{
				$stmt = $this->conn->prepare($sql);
				$stmt->execute();
				$row = $stmt->fetchAll(PDO::FETCH_ASSOC);			
			}
			catch(PDOException $e){
				echo $e->getMessage();
			}
			return $row;
		}

		public function getRecordByUsername($username){
			$row;
			$sql = "SELECT * FROM USER WHERE user_username = ?";
			try
			{
				$stmt = $this->conn->prepare($sql);
				$stmt->execute(array($username));
				$row = $stmt->fetch(PDO::FETCH_ASSOC);
			}
			catch(PDOException $e)
			{
				echo $e->getMessage();
			}

			return $row;
		}

		public function insertRecord($fname,$lname,$address,$bdate,$postal_code,$email,$phone,$username,$password){
			$row;
			$sql = "INSERT INTO user (user_fname,user_lname,user_address,user_birthdate,user_postal_code,user_email,user_phone,user_username,user_password) VALUES(?,?,?,?,?,?,?,?,?)";
			try{
				$stmt=$this->conn->prepare($sql);
				$row=$stmt->execute(array($fname,$lname,$address,$bdate,$postal_code,$email,$phone,$username,$password));
			}catch(PDOException $e)
			{
				echo $e->getMessage();
			}
			return $row;
		}

	}