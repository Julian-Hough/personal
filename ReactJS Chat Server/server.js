//modules
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);

//keeps track of all users typing
var usersTyping = (function () {
  var names = {};

  // serialize claimed names as an array
  var get = function () {
    var res = [];
    for (user in names) {
      res.push(user);
    }

    return res;
  };
  
  var claim = function (name) {
    if (!name || names[name]) {
      return false;
    } else {
      names[name] = name;
      return true;
    }
  };
  
  var free = function (name) {
    if (names[name]) {
      delete names[name];
	  return true;
    }else {
		return false;
	}
  };

  return {
	claim: claim,
    free: free,
    get: get,
  };
}());

// Keep track of which names are used so that there are no duplicates
var userNames = (function () {
  var names = {};

  var claim = function (name) {
    if (!name || names[name]) {
      return false;
    } else {
      names[name] = true;
      return true;
    }
  };

  // find the lowest unused "guest" name and claim it
  var getGuestName = function () {
    var name,
      nextUserId = 1;

    do {
      name = 'User' + nextUserId;
      nextUserId += 1;
    } while (!claim(name));

    return name;
  };

  // serialize claimed names as an array
  var get = function () {
    var res = [];
    for (user in names) {
      res.push(user);
    }

    return res;
  };

  var free = function (name) {
    if (names[name]) {
      delete names[name];
    }
  };

  return {
    claim: claim,
    free: free,
    get: get,
    getGuestName: getGuestName
  };
}());



//public directory
app.use(express.static(path.join(__dirname, 'public')));


/* Socket.io Communication */
io.on('connection', function(socket) {
	var name = userNames.getGuestName();

  // send the new user their name and a list of users
  socket.emit('init', {
    name: name,
    users: userNames.get(),
	userstyping: usersTyping.get()
  });

  // notify other clients that a new user has joined
  socket.broadcast.emit('user:join', {
    name: name
  });

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
    socket.broadcast.emit('send:message', {
      user: name,
      text: data.text
    });
  });
  
  //adds user name to userstyping and broadcast to others
  socket.on('user:typingjoin', function(user) {
	  if (usersTyping.claim(user)) {
		  socket.broadcast.emit('user:typing', {
			userstyping: usersTyping.get(),
			name: user
		  });
	  }
  });	
	
 //removes user name from userestyping and broadcast to others
  socket.on('user:typingleft', function(user) {
	  if (usersTyping.free(user)) {
		  socket.broadcast.emit('user:typing', {
			 userstyping: usersTyping.get(),
			 name: user
		  });
	  }
  });	
  // validate a user's name change, and broadcast it on success
  socket.on('change:name', function (data, fn) {
    if (userNames.claim(data.name)) {
      var oldName = name;
      userNames.free(oldName);
	  usersTyping.free(oldName);
	  
      name = data.name;
      
      socket.broadcast.emit('change:name', {
        oldName: oldName,
        newName: name
      });
	
      fn(true);
    } else {
      fn(false);
    }
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.emit('user:left', {
      name: name
    });
    userNames.free(name);
	usersTyping.free(name);
  });
});

/* Start server */
http.listen(3000, function(){
  console.log('Server up on *:3000');
});