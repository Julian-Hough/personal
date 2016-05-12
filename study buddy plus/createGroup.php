<?php
    function creatGroup($g, $c, $d) {
        $servername = "104.236.200.134";
        $d_username = "buddy";
        $d_password = "";
        $db_name = "studybuddyplus";
        $db_handle = new PDO("mysql:host=$servername;dbname=$db_name", "$d_username", "$d_password");

        $rslt = $db_handle->query("SELECT * FROM groups WHERE name='$g'");
        if(sizeof($rslt)!=0){
            throw new Exception('This group name is already taken.');
        }

        $insert_stmt = $db_handle->prepare("INSERT INTO `groups`(`name`,`courseNum`,`descr`,`creator`,`time`,`level`)VALUES(?,?,?,?,?,?) ");
        
        if (empty($g)) {
            throw new Exception('Please Fill The Group Name.');
        } else {
            $gName = $g;
        }
        if (empty($c)) {
            throw new Exception('Please Fill The Course Number.');
        } else {
            $cNum = $c;
        }
        if (empty($d)) {
            throw new Exception('Please Fill The Group Description.');
        } else {
            $descr = $d;
        }
        
        
        $creator = $_SESSION['login_user'];
        $t = date('Y-m-d');
        if ($_POST['radio'] == 'option1') {
            $level = 1;
        } elseif ($_POST['radio'] == 'option2') {
            $level = 2;
        } else {
            $level = 3;
        }
        $insert_stmt->bindParam(1, $gName);
        $insert_stmt->bindParam(2, $cNum);
        $insert_stmt->bindParam(3, $descr);
        $insert_stmt->bindParam(4, $creator);
        $insert_stmt->bindParam(5, $t);
        $insert_stmt->bindParam(6, $level);
        $res = $insert_stmt->execute();
        $db_handle->setAttribute(PDO::ATTR_EMULATE_PREPARES,false); 
        if ($res) {
            $mess = true;
        } else {
            $error = $insert_stmt->errorInfo();
            throw new Exception($error);
            $mess = false;
        }
        $addMember_stmt = $db_handle->prepare("INSERT INTO `members`(`student`,`groupName`)VALUES(?,?) ");
        $addMember_stmt->bindParam(1, $creator);
        $addMember_stmt->bindParam(2, $gName);
        $addMember_stmt->execute();
        return $mess;
    }
?>