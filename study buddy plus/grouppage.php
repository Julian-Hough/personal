<?php
    include('session.php');
    include('getGroup.php');
    //page for study groups
    //functionality: pull all posts/write posts/all group memebers/access to the shared files/upload files
    //More: access to individual user profile

    //more php files:
    //manageMyGroups.php where users can add into a group/leave a group/create a group/delete a group
    //mysql table groups:
    //admin(store username who create the group | time(date of creation | number(group size |
    //echo $_POST['groupname'];
    $group = $_POST['gname'];
?>
<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Study Buddy+ | Group</title>

    <!-- Bootstrap Core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="css/internal_style.css" rel="stylesheet">

    <!-- Morris Charts CSS -->
    <link href="css/plugins/morris.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body>

<div id="wrapper">

    <!-- Navigation -->
    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="dashboard.php">StudyBuddy+</a>
        </div>
        <!-- Top Menu Items -->
        <ul class="nav navbar-right top-nav">
            <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-user"></i> <?php echo $_SESSION['login_user']; ?> <b
                        class="caret"></b></a>
                <ul class="dropdown-menu">
                    <li>
                        <a href="profile.php"><i class="fa fa-fw fa-user"></i> Profile</a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="logout.php"><i class="fa fa-fw fa-power-off"></i> Log Out</a>
                    </li>
                </ul>
            </li>
        </ul>
        <?php 
            $data = getGroup($_SESSION["login_user"]);
        ?>
        <!-- Sidebar Menu Items - These collapse to the responsive navigation menu on small screens -->
        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav side-nav">
                <li>
                    <a href="dashboard.php"><i class="fa fa-fw fa-dashboard"></i> Dashboard</a>
                </li>
                <li class="active">
                    <a href="javascript:" data-toggle="collapse" data-target="#demo"><i
                            class="fa fa-fw fa-arrows-v"></i> My Groups <i class="fa fa-fw fa-caret-down"></i></a>
                    <ul id="demo" class="collapse">
                       
                        <?php 
                        foreach($data as $oneGroup) {
                            //echo "<li><form action='grouppage.php' method='post'><input type='submit' name='groupname' value='$oneGroup[0]'/></form></li>"; 
                            echo "<li><form action='grouppage.php' method='post'>
                                <input style='display:none' name='gname' value='$oneGroup[0]'/>
                                <a style='color:white;margin-left:30px;' href='grouppage.php' onclick=\"this.parentNode.submit(); return false;\">$oneGroup[0]</a>
                            </form></li>";
                        }
                        ?>
                        
                    </ul>
                </li>
                <li>
                    <a href="create_group.php"><i class="fa fa-fw fa-edit"></i> Create Group</a>
                </li>
                <li>
                    <a href="calendar.html"><i class="fa fa-fw fa-table"></i>My Calendar</a>
                </li>
            </ul>
        </div>
        <!-- /.navbar-collapse -->
    </nav>

    <div id="page-wrapper">

        <div class="container-fluid">

            <!-- Page Heading -->
            <div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header">
                        <?php echo $_POST['gname']; 
                            $groupinfo = getGroupInfoByName($group);
                        ?>
                        <small>
                        <?php 
                            if ($groupinfo[0]['level'] == 1) {
                                $groupType = "Official Class Group";
                            } elseif ($groupinfo[0]['level'] == 2) {
                                $groupType = "Normal Study Group";
                            } else {
                                $groupType = "Group Project";
                            }
                            echo ( $groupType ." (created at " . $groupinfo[0]['time'] . ")");
                        ?>
                        </small>
                    </h1>
                    <ol class="breadcrumb">
                        <li class="active">
                            <i class="fa fa-group"></i> <?php echo "Group Description: " . $groupinfo[0]['descr'] ?>
                        </li>
                    </ol>
                </div>
            </div>
            <!-- /.row -->

            <div class="row">
                <div class="col-lg-12">
                    <div class="alert alert-info alert-dismissable">
                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                        <i class="fa fa-info-circle"></i>  <strong>Welcome!</strong> This is a study group page.
                    </div>
                </div>
            </div>
        </div>
        <!-- /.row -->
        <?php 
            //script for insert posts into databases
            if (isset($_POST['send']) && $_POST['send'] == 'send') {
                $servername = "104.236.200.134";
                $d_username = "buddy";
                $d_password = "";
                $db_name = "studybuddyplus";
                $db_handle = new PDO("mysql:host=$servername;dbname=$db_name", "$d_username", "$d_password");
                $insert_stmt = $db_handle->prepare("INSERT INTO `posts`(`student`,`groupName`,`comment`,`time`)VALUES(?,?,?,?)");
                $comm = $_POST['comment'];
                $student = $_SESSION['login_user'];
                $t = date('Y-m-d');
                if (empty($comm)) {
                    echo "Please Enter Your Post!";
                } else {
                    echo "Your Post Sent.";
                    $insert_stmt->bindParam(1, $student);
                    $insert_stmt->bindParam(2, $group);
                    $insert_stmt->bindParam(3, $comm);
                    $insert_stmt->bindParam(4, $t);
                    $insert_stmt->execute();
                }
            }
        ?>
        <form action="grouppage.php" method="post">
            <input style="display:none" name="gname" type="text" value="<?php echo $group?>"/>
            <input style="width:40%" name="comment" type="text" placeholder="write your post here"/>
            <input name="send" type="submit" value="send"/>
        </form>
        <div class="row">
            <div class="col-lg-3 col-md-6">
                <div class="panel panel-primary">
                    <div class="panel-heading">
                        <div class="row">
                            <div class="col-xs-3">
                                <i class="fa fa-comments fa-5x"></i>
                            </div>
                            <div class="col-xs-9 text-right">
                                <div class="huge"><?php $allPosts = getPostsByGroup($group); echo count($allPosts); ?></div>
                                <div>Posts in this group!</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- /.row -->
        <div class="row">
            <div class="col-lg-8">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title"><i class="fa fa-long-arrow-right fa-fw"></i>Discussion Board</h3>
                    </div>
                    <div class="panel-body">
                        <div id="morris-donut-chart">
                        <?php 
                        $allPosts = getPostsByGroup($group);
                        foreach($allPosts as $onePost) {
                            //print_r ($onePost);
                            echo "<li>$onePost[0] said: $onePost[2] at <span class='badge'>$onePost[3]</span></li>";
                        }
                        
                        ?>
                        </div>
                       
                    </div>
                </div>
            </div>
            <?php
                //script to verify if the login user is the creator
                $servername = "104.236.200.134";
                $d_username = "buddy";
                $d_password = "";
                $db_name = "studybuddyplus";
                $db_handle = new PDO("mysql:host=$servername;dbname=$db_name", "$d_username", "$d_password");
                $search_stmt = $db_handle->prepare("SELECT `creator` FROM groups WHERE name=?;");
                $search_stmt->bindParam(1, $group);
                $search_stmt->execute();
                $creator = $search_stmt->fetchAll();
                $admin = $creator[0][0];
                if ($admin == $_SESSION['login_user']) {
                    echo '<div class="col-lg-4">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <h3 class="panel-title"><i class="fa fa-clock-o fa-fw"></i>Add a Group Member</h3>
                                </div>
                                <div class="panel-body">
                                    <form action="grouppage.php" method="post">
                                        <div class="list-group">
                                            Enter username, first name, or last name to search for a user
                                            <input style="display:none" name="gname" value="'.$oneGroup[0].'"/>
                                            <input style="width:80%" name="keyword" type="text" placeholder="enter keyword to search a user here"/>
                                        </div>
                                        <div class="text-right">
                                            <input name="send" type="submit" value="search user"/>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ';
                }
                if (isset($_POST['send']) && $_POST['send'] == "search user") {
                    // Establishing Connection with Server by passing servername, d_username and d_password as a parameter
                    $connection = mysql_connect("$servername", "$d_username", "$d_password");
                    $name = $_POST['keyword'];
                    // Selecting Database
                    $db = mysql_select_db("$db_name", $connection);
                    //$query = mysql_query("SELECT * FROM login WHERE username='$username'", $connection);
                    $sql="SELECT username, firstname, lastname FROM login WHERE 
                        username LIKE '%" . $name . "%' OR firstname LIKE '%" . $name . "%' OR lastname LIKE '%" . $name . "%'";
                    $query = mysql_query($sql,$connection);
                    //$query = mysql_fetch_assoc($query);
                    $result = mysql_fetch_array($query);
                    $username = $result[0];
                    $firstname = $result[1];
                    $lastname = $result[2];
                    echo "<h4 style='margin-left:2%'>Found User:$username True Name: $firstname $lastname</h4>";
                    echo "<form action='grouppage.php' method='post' style='margin-left:2%'>
                                <input style='display:none' name='gname' value='$oneGroup[0]'/>
                                <input style='display:none' name='target_user' type='text' value='$username'/>
                                <input name='add' type='submit' value='add user to the group'/>
                          </form>";
                    mysql_close($connection); // Closing Connection
                }
                if (isset($_POST['add']) && $_POST['add'] == "add user to the group") {
                    $db_handle = new PDO("mysql:host=$servername;dbname=$db_name", "$d_username", "$d_password");
                    $insert_stmt = $db_handle->prepare("INSERT INTO `members`(`student`,`groupName`) VALUES(?,?)");
                    $insert_stmt->bindParam(1, $_POST['target_user']);
                    $insert_stmt->bindParam(2, $_POST['gname']);
                    $insert_stmt->execute();
                    $success = $insert_stmt->fetchAll();
                    echo "<h4 style='margin-left:2%'>Group Added!</h4>";
                }
            ?>
            
            
        </div>
        <!-- /.row -->

    </div>
    <!-- /.container-fluid -->

</div>
<!-- /#page-wrapper -->

</div>
<!-- /#wrapper -->

<!-- jQuery -->
<script src="js/jquery.js"></script>

<!-- Bootstrap Core JavaScript -->
<script src="js/bootstrap.min.js"></script>

</body>

</html>
