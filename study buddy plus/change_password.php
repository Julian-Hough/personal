<?php
    include 'session.php';
    include('getGroup.php');
	include 'passwordchange.php';
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
        <div id="wrapper">
            <!-- Navigation -->
            <div id="page-wrapper">
                <div class="container-fluid">

                    <!-- Page Heading -->
                    <div class="row">
                        <div class="col-lg-12">
                            <h1 class="page-header">
                                SB+ <small>Change Password</small>
                            </h1>
                        </div>
                    </div>
                    <!-- /.row -->

                    <div class="row">
                        <div class="col-lg-12">
                            <div class="alert alert-info alert-dismissable">
                                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                                <i class="fa fa-info-circle"></i>  <strong>Profile</strong>  This is your profile page. Here you can see more information about your account.
                            </div>
                        </div>
                    </div>
                    <!-- /.row -->
                    <div class="col-lg-4">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title"><i class="fa fa-clock-o fa-fw"></i>Change Password</h3>
                            </div>
                            <div class="panel-body">
                                <div class="list-group">
									<form action="" method="post">
										<div><?php
												echo $error;
											  ?>
										</div>
					
										<div class="form-group col-md-12">                    
											<label>Old Password</label>
											<input id="old_password" name="old_password" type="password" class="form-control" placeholder="Enter your old password" required>
										</div>
										<div class="form-group col-md-12">                    
											<label>Password</label>
											<input id="password" name="password" type="password" class="form-control" placeholder="Enter a new password" required>
										</div>
										<div class="form-group col-md-12">                    
											<label>Please confirm your password</label>
											<input id="password2" name="password2" type="password" class="form-control" placeholder="Enter the same password again" required>
										</div>
										<div class="form-group col-md-12">
											<input name="submit" type="submit" value="Change Password" class="btn btn-success">
										</div>
									</form>
                                </div>
       
                            </div>
                        </div>
                    </div>
                    
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