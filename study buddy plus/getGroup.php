<?php
    //get all the group names that one user belonging to
    function getGroup($username) {
        $servername = "104.236.200.134";
        $d_username = "buddy";
        $d_password = "";
        $db_name = "studybuddyplus";
        $db_handle = new PDO("mysql:host=$servername;dbname=$db_name", "$d_username", "$d_password");
        /*
        if ($db_handle) {
            echo "CONNECTED";
        }
        */
        $find_stmt = $db_handle->prepare("SELECT groupName FROM members WHERE student=?;");
        $find_stmt->bindParam(1, $username);
        $find_stmt->execute();
        $res = $find_stmt->fetchAll();
        return $res;
    }
    function getPostsByGroup($group) {
        $servername = "104.236.200.134";
        $d_username = "buddy";
        $d_password = "";
        $db_name = "studybuddyplus";
        $db_handle = new PDO("mysql:host=$servername;dbname=$db_name", "$d_username", "$d_password");
        $getUpdate_stmt = $db_handle->prepare("SELECT * FROM posts WHERE groupName=?;");
        $getUpdate_stmt->bindParam(1, $group);
        $getUpdate_stmt->execute();
        $posts = $getUpdate_stmt->fetchAll();
        return $posts;
    }
    function getPostsByGroup_latest3($group) {
        $servername = "104.236.200.134";
        $d_username = "buddy";
        $d_password = "";
        $db_name = "studybuddyplus";
        $db_handle = new PDO("mysql:host=$servername;dbname=$db_name", "$d_username", "$d_password");
        $getUpdate_stmt = $db_handle->prepare("SELECT * FROM posts WHERE groupName=?;");
        $getUpdate_stmt->bindParam(1, $group);
        $getUpdate_stmt->execute();
        $posts = array();
        $onePost = $getUpdate_stmt->fetch();
        array_push($posts, $onePost);
        $onePost = $getUpdate_stmt->fetch();
        array_push($posts, $onePost);
        $onePost = $getUpdate_stmt->fetch();
        array_push($posts, $onePost);
        return $posts;
    }
    function getGroupInfoByName($group) {
        $servername = "104.236.200.134";
        $d_username = "buddy";
        $d_password = "";
        $db_name = "studybuddyplus";
        $db_handle = new PDO("mysql:host=$servername;dbname=$db_name", "$d_username", "$d_password");
        $search_stmt = $db_handle->prepare("SELECT * FROM groups WHERE name=?;");
        $search_stmt->bindParam(1, $group);
        $search_stmt->execute();
        $data = $search_stmt->fetchAll();
        return $data;
    }
    function getPostsByGroupName($group) {
        $servername = "104.236.200.134";
        $d_username = "buddy";
        $d_password = "";
        $db_name = "studybuddyplus";
        $db_handle = new PDO("mysql:host=$servername;dbname=$db_name", "$d_username", "$d_password");
        $search_stmt = $db_handle->prepare("SELECT * FROM posts WHERE groupName=?;");
        $search_stmt->bindParam(1, $group);
        $search_stmt->execute();
        $data = $search_stmt->fetchAll();
        return $data;
    }
?>