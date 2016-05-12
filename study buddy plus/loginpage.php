<?php
	include('login.php'); //includes login script
	if(isset($_SESSION['login_user'])) {
		header("location: dashboard.php"); //if successful login redirects to studybuddyplus.php
	}
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">

        <title>Study Buddy+ | Log In</title>

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
                <a class="navbar-brand" href="index.html">StudyBuddy+</a>
            </div>
        </nav>

        <div id="wrapper">

            <!-- Navigation -->
            <div id="page-wrapper-ctr">

                <div class="container-fluid">

                    <!-- Page Heading -->
                    <div class="row">
                        <div class="col-lg-12">
                            <h1 class="page-header">
                                StudyBuddy+ <small>Login</small>
                            </h1>
                        </div>
                    </div>
                    <!-- /.row -->

                    <div class="row">
                        <div class="col-lg-12">
                            <div class="alert alert-info alert-dismissable">
                                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                                <i class="fa fa-info-circle"></i>  <strong>Login</strong>  Use this page to login to your account.
                            </div>
                        </div>
                    </div>
                    <!-- /.row -->

                    <form action="" method="post">
					<div><?php echo $error; ?></div>
                        <div class="form-group col-md-12">                    
                            <label>Username</label>
                            <input id="username" name="username" class="form-control" placeholder="Your username" required>
                        </div>
                        <div class="form-group col-md-12">                    
                            <label>Password</label>
                            <input id="password" name="password" type="password" class="form-control" placeholder="Your Password" required>
                        </div>
                        <input name="submit" type="submit" value=" Login" class="btn btn-success"><!--Login</button-->
                        <div>
                            <button type="button" class="btn btn-link">Forget Your Password?</button>
                            <button onclick="location.href='registration.php';" type="button" class="btn btn-link">Register</button>
                        </div>
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