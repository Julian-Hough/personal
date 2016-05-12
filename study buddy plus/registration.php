<?php
	include('register.php'); //includes login script
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
                    <a class="navbar-brand" href="index.html">StudyBuddy+</a>
                </div>
                <!-- Top Menu Items -->
                <ul class="nav navbar-right top-nav">


                </ul>
                <!-- Sidebar Menu Items - These collapse to the responsive navigation menu on small screens -->
            </nav>

            <div id="page-wrapper-ctr">

                <div class="container-fluid">

                    <!-- Page Heading -->
                    <div class="row">
                        <div class="col-lg-12">
                            <h1 class="page-header">
                                StudyBuddy+ <small>Registration</small>
                            </h1>
                        </div>
                    </div>
                    <!-- /.row -->

                    <div class="row">
                        <div class="col-lg-12">
                            <div class="alert alert-info alert-dismissable">
                                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                                <i class="fa fa-info-circle"></i>  <strong>Registration</strong>  Use this page to create your account.
                            </div>
                        </div>
                    </div>
                    <!-- /.row -->

                    <form action="" method="post">
					<div><?php 
                            if (isset($succ)) {
                                //registration success
                                echo "<h2>You have registered successfully.</h2>";
                                echo "<p>Redirect to login page in three second......</p>"; 
                                echo "<meta http-equiv='refresh' content='3;url=loginpage.php'>";     
                                exit;
                            } else {
                                echo $error;
                            }
                        
                        ?>
                    </div>
                        <div class="form-group col-md-6">                    
                            <label>First Name</label>
                            <input id="firstname" name="firstname" class="form-control" placeholder="First Name" required>
                        </div>

                        <div class="form-group col-md-6">                    
                            <label>Last Name</label>
                            <input id="lastname" name="lastname" class="form-control" placeholder="Last Name" required>
                        </div>
                        <div class="form-group col-md-12">                    
                            <label>Username</label>
                            <input id="username" name="username" class="form-control" placeholder="Choose a username" required>
                        </div>

                        <div class="form-group col-md-12">                    
                            <label>Email</label>
                            <input id="email" name="email" type="email" class="form-control" placeholder="Enter your .edu email" required>
                        </div>
                        <div class="form-group col-md-6">                    
                            <label>Password</label>
                            <input id="password" name="password" type="password" class="form-control" placeholder="Enter a password" required>
                        </div>
                        <div class="form-group col-md-6">                    
                            <label>Please confirm your password</label>
                            <input id="password2" name="password2" type="password" class="form-control" placeholder="Enter the same password again" required>
                        </div>
                        <input name="submit" type="submit" value="Create Account" class="btn btn-success">
                        <br/>
                        <p>Already have an account?</p>
                        <a href="loginpage.php" class="btn btn-primary" role="button">Log In</a>
                        <br/>
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