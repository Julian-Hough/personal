<?php
	include('session.php');
    include('getGroup.php');
    include('createGroup.php');
?>

<!DOCTYPE html>
<html lang="en">

    <head>

        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">

        <title>Study Buddy+ | Create Group</title>

        <!-- Bootstrap Core CSS -->
        <link href="css/bootstrap.min.css" rel="stylesheet">

        <!-- Custom CSS -->
        <link href="css/internal_style.css" rel="stylesheet">

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
    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">StudyBuddy+</a>
        </div>
        <!-- Top Menu Items -->
        <ul class="nav navbar-right top-nav">
            <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-user"></i> <?php echo $_SESSION['login_user']; ?><b class="caret"></b></a>
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
        <!-- Sidebar Menu Items - These collapse to the responsive navigation menu on small screens -->
        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav side-nav">
                <li>
                    <a href="dashboard.php"><i class="fa fa-fw fa-dashboard"></i> Dashboard</a>
                </li>
                <li>
                    <a href="javascript:" data-toggle="collapse" data-target="#demo"><i class="fa fa-fw fa-arrows-v"></i> My Groups <i class="fa fa-fw fa-caret-down"></i></a>
                    <ul id="demo" class="collapse">
                        <?php
                        $data = getGroup($_SESSION["login_user"]);
                        foreach($data as $oneGroup) {
                            //echo "<li><form action='grouppage.php' method='post'><input type='submit' name='groupname' value='$oneGroup[0]'/></form></li>"; 
                            echo "<li><form action='grouppage.php' method='post'>
                                <input style='display:none' name='gname' value='$oneGroup[0]'/>
                                <a href='grouppage.php' onclick=\"this.parentNode.submit(); return false;\">$oneGroup[0]</a>
                            </form></li>";
                        }
                        ?>
                    </ul>
                </li>
                <li class="active">
                    <a href="create_group.php"><i class="fa fa-fw fa-edit"></i> Create Group</a>
                </li>
                <li>
                    <a href="calendar.html"><i class="fa fa-fw fa-table"></i>My Calendar</a>
                </li>
            </ul>
        </div>
        <!-- /.navbar-collapse -->
    </nav>

        <div id="wrapper">

            <!-- Navigation -->
            <div id="page-wrapper">

                <div class="container-fluid">

                    <!-- Page Heading -->
                    <div class="row">
                        <div class="col-lg-12">
                            <h1 class="page-header">
                                StudyBuddy+ <small>Create Group</small>
                            </h1>
                        </div>
                    </div>
                    <!-- /.row -->

                    <div class="row">
                        <div class="col-lg-12">
                            <div class="alert alert-info alert-dismissable">
                                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                                <i class="fa fa-info-circle"></i>  <strong>Group Creation</strong>  Use this page to create a group that you can use to study.
                            </div>
                        </div>
                    </div>
                    <!-- /.row -->
                    <div>
                    <?php
                        if (isset($_POST['submit']) && $_POST['submit'] == 'submit') {
                            
                            try {
                                $mess = creatGroup($_POST['groupName'], $_POST['courseNum'], $_POST['desc']);
                            } catch (Exception $e) { 
                                print_r($e->getMessage());
                            }
                            if (isset($mess) && $mess) {
                                echo "<div class=\"col-lg-12\">
                                        <div class=\"alert alert-success alert-dismissable\">
                                            <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>
                                            <i class=\"fa fa-info-circle\"></i>  <strong>SUCCESS!!</strong>  Your group was created.
                                        </div>
                                    </div>";
                                echo "<p>You will be redirected to your dashboard shortly....</p>";
                                echo "<meta http-equiv='refresh' content='3;url=dashboard.php'>";    
                                exit;
                            } 
                        }
                        
                          
                    ?>
                    </div>
                    <form action="create_group.php" method="post">
                        <div class="form-group col-md-6">                    
                            <label>Group Name</label>
                            <input class="form-control" name="groupName" placeholder="Enter Group Name">
                        </div>
                        <div class="form-group col-md-6">
                            <label>Course Number</label>
                            <input class="form-control" name="courseNum" placeholder="Enter Course Number">
                        </div>
                        <div class="form-group col-md-12">
                            <label>Description</label>
                            <textarea class="form-control" name="desc" rows="3" placeholder="Enter a short description about your group."></textarea>
                        </div>
                        <label>What is group this for?</label>
                        <div class="radio">
                            <label>
                                <input type="radio" name="radio" id="optionsRadios1" value="option1">Official Class
                            </label>
                        </div>
                        <div class="radio">
                            <label>
                                <input type="radio" name="radio" id="optionsRadios2" value="option2" checked>Study Group
                            </label>
                        </div>
                        <div class="radio">
                            <label>
                                <input type="radio" name="radio" id="optionsRadios3" value="option3">Group Project
                            </label>
                        </div>
                        <button type="submit" name="submit" value="submit" class="btn btn-success">Submit</button>
                        <button type="reset" class="btn btn-danger">Reset</button>
                        <!--</div>-->
                    </form>
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