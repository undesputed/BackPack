<?php
	
	class DBConnect{

		private $hostname='localhost'; //127.0.0.1
		private $username='root';
		private $password='';
		private $database='bakpak';
		private $conn;

		function __construct(){
			  try{
		        $this->conn=new PDO("mysql:host=$this->hostname;dbname=$this->database",$this->username,$this->password);
		    }catch(PDOException $e){ echo $e->getMessage();}
		}

		function logginUser($username,$password){
	        $flag= false;
	        // $password = md5($pass);
	        $sql = "SELECT * FROM user WHERE user_username = ? AND user_password = ?";
	        $stmt = $this->conn->prepare($sql);
	        $stmt->execute(array($username,$password));
	        $row = $stmt->fetch(PDO::FETCH_ASSOC);
	        // $variable = array($username,$password);
	        // echo json_encode($variable);	  
	        if($stmt->rowCount() > 0)
	        {	           
	            $flag = true;
	        }
	        $this->conn = null;
	        return $flag;   
    	}

    	function getUserByUsername($username)
    	{
    		$sql = "SELECT * FROM user where user_username = ?";
    		try
    		{
    			$stmt = $this->conn->prepare($sql);
	            $stmt->execute(array($username));
	            $row = $stmt->fetch(PDO::FETCH_ASSOC);
    		}catch(PDOException $e)
    		{
    			echo $e->getMessage();
    		}
    	}

		function insertRecord($fname,$lname,$phone,$email,$address,$username,$pass){
        	$ok;
        	$password = md5($pass);
        	$sql = "INSERT INTO user(user_fname, user_lname, user_phone, user_email, user_address, user_username,user_password, ) values(?,?,?,?,?,?,?)";
        	try{
	            $stmt=$this->conn->prepare($sql);
	            $ok=$stmt->execute(array($fname,$lname,$phone,$email,$address,$username,$pass));
	        }catch(PDOException $e){ echo $e->getMessage();}
	        return $ok;
    	}

    	function getAllRecord(){
	        $rows;
	        $sql="SELECT * FROM user";
	        try{
	            $stmt=$this->conn->prepare($sql);
	            $stmt->execute();
	            $rows=$stmt->fetchAll(PDO::FETCH_ASSOC);
	        }catch(PDOException $e){ echo $e->getMessage();}
	        return $rows;
	    }

	    function getAllApplicant(){
	    	$rows;
	    	$sql="SELECT * FROM applicant";
	    	try{
	    		$stmt=$this->conn->prepare($sql);
	            $stmt->execute();
	            $rows=$stmt->fetchAll(PDO::FETCH_ASSOC);
	    	}catch(PDOException $e){ echo $e->getMessage(); }
	    	return $rows;
	    }

	    function getAllProduct(){
	    	$rows;
	    	$sql = "SELECT * FROM product";
	    }
		// function connect(){
		// 	include_once dirname(__FILE__).'/Constants.php';

		// 	$this->con = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

		// 	if(mysqli_connect_error())
		// 	{
		// 		echo "Failed to Connect with database".mysqli_connect_error();
		// 	}

		// 	return $this->con;
		// }
	}