var socket = io();

var UserList = React.createClass({
	displayName: 'UserList',

	render: function() {
		return React.createElement(
			'div',
			{ className: 'users' },
			React.createElement(
				'h3',
				null,
				' Online Users '
			),
			React.createElement(
				'ul',
				null,
				this.props.users.map(function (user, i) {
					return React.createElement(
						'li',
						{ key: i , className: 'user'},
						React.createElement(
						'span',
						null,
						user
						)
					);
				})
			)
		);
	}
});

var UserTypingList = React.createClass({
	displayName: 'UserTypingList',
	
	render: function() {
		return React.createElement(
			'div',
			{ className: 'userstyping' },
			React.createElement(
				'h3',
				null,
				' Users Typing '
			),
			React.createElement(
				'ul',
				{ className: 'typing'},
				this.props.userstyping.map(function (user, i) {
					return React.createElement(
						'li',
						{ key: i },
						user
					);
				})
			) 
		);
	}
});

var Message = React.createClass({
	displayName: 'Message',

	render: function() {
		return React.createElement(
			'div',
			{ className: 'message' },
			React.createElement(
				'strong',
				null,
				this.props.user,
				' : '
			),
			React.createElement(
				'span',
				null,
				this.props.text
			)
		);
	}
});

var MessageList = React.createClass({
	displayName: 'MessageList',
	componentDidUpdate: function() {
		var node = this.getDOMNode();
		node.scrollTop = node.scrollHeight;
	},

	render: function() {
		return React.createElement(
			'div',
			{ className: 'messages' },
			React.createElement(
				'h2',
				null,
				' Messages: '
			),
			
			this.props.messages.map(function (message, i) {
				return React.createElement(Message, {
					key: i,
					user: message.user,
					text: message.text
				});
			})
		);
	}
});

var MessageForm = React.createClass({
	displayName: 'MessageForm',

	getInitialState: function() {
		return { text: '' };
	},

	handleSubmit: function(e) {
		e.preventDefault();
		var message = {
			user: this.props.user,
			text: this.state.text
		};
		this.props.onMessageSubmit(message);
		this.setState({ text: '' });
		this.props.onUserTypeStop(this.props.user);
	},

	changeHandler: function(e) {
		this.setState({ text: e.target.value });
		if (e.target.value == '') {
			this.props.onUserTypeStop(this.props.user);
		}else {
			this.props.onUserTyping(this.props.user);
		}
	},

	render: function() {
		
		
		return React.createElement(
			'div',
			{ className: 'message_form' },
			React.createElement(
				'h3',
				null,
				'Send a Message as ' + this.props.user
			),
			React.createElement(
				'form',
				{ onSubmit: this.handleSubmit },
				React.createElement('input', {
					onChange: this.changeHandler,
					value: this.state.text
				}),
				React.createElement('button', null, 'Send')
			)
		);
	}
});

var ChangeNameForm = React.createClass({
	displayName: 'ChangeNameForm',

	getInitialState: function() {
		return { newName: '' };
	},

	onKey: function(e) {
		this.setState({ newName: e.target.value });
	},

	handleSubmit: function(e) {
		e.preventDefault();
		var newName = this.state.newName;
		this.props.onChangeName(newName);
		this.setState({ newName: '' });
	},

	render: function() {
		return React.createElement(
			'div',
			{ className: 'change_name_form' },
			React.createElement(
				'h3',
				null,
				' Change Name '
			),
			React.createElement(
				'form',
				{ onSubmit: this.handleSubmit },
				React.createElement('input', {
					onChange: this.onKey,
					value: this.state.newName
				}),
				React.createElement('button', null, 'Change')
			)
		);
	}
});

var ChatApp = React.createClass({
	displayName: 'ChatApp',

	getInitialState: function() {
		return { users: [], userstyping: [], messages: [], text: '' };
	},

	componentDidMount: function() {
		socket.on('init', this.initialize);
		socket.on('send:message', this.messageRecieve);
		socket.on('user:join', this.userJoined);
		socket.on('user:left', this.userLeft);
		socket.on('change:name', this.userChangedName);
		socket.on('user:typing', this.userTyping);
	},

	initialize: function(data) {
		var users = data.users;
		var name = data.name;
		var userstyping = data.userstyping;
		
		this.setState({ users: users, user: name, userstyping: userstyping });
	},

	messageRecieve: function(message) {
		var messages = this.state.messages;

		messages.push(message);
		this.setState({ messages: messages });
	},
	
	userTyping: function(data) {
		var state4 = this.state;
		var userstyping = [];
		for (user in data.userstyping) {
			if (data.userstyping[user] != this.state.user) {
				userstyping.push(data.userstyping[user]);
			}
		}
		this.setState({ userstyping: userstyping });
	},
	
	userJoined: function(data) {
		var state = this.state;
		var users = state.users;
		var messages = state.messages;
		var name = data.name;

		users.push(name);
		messages.push({
			user: 'Server',
			text: name + ' Joined'
		});
		this.setState({ users: users, messages: messages });
	},

	userLeft: function(data) {
		var state2 = this.state;
		var users = state2.users;
		var messages = state2.messages;
		var name = data.name;

		var index = users.indexOf(name);
		users.splice(index, 1);
		messages.push({
			user: 'Server',
			text: name + ' Left'
		});
		this.setState({ users: users, messages: messages });
	},

	userChangedName: function(data) {
		var oldName = data.oldName;
		var newName = data.newName;
		var state3 = this.state;
		var users = state3.users;
		var messages = state3.messages;

		var index = users.indexOf(oldName);
		users.splice(index, 1, newName);
		messages.push({
			user: 'Server',
			text: 'User ' + oldName + ' changed their name to ' + newName
		});
		this.setState({ users: users, messages: messages });
	},

	handleUserTypingJoin: function(user) {
		var userstyping = this.state.userstyping;
		this.setState({ userstyping: userstyping });
		socket.emit('user:typingjoin', this.state.user);
	},
	
	handleUserTypingLeft: function(user) {
		var userstyping = this.state.userstyping;
		this.setState({ userstyping: userstyping });
		socket.emit('user:typingleft', this.state.user);
	},
	
	handleMessageSubmit: function(message) {
		var messages = this.state.messages;

		messages.push(message);
		this.setState({ messages: messages });
		socket.emit('send:message', message);
	},

	handleChangeName: function(newName) {
		var _this = this;

		var oldName = this.state.user;
		socket.emit('change:name', { name: newName }, function (result) {
			if (!result) {
				return alert('There was an error changing your name');
			}
			var users = _this.state.users;

			var index = users.indexOf(oldName);
			users.splice(index, 1, newName);
			_this.setState({ users: users, user: newName });
		});
	},

	render: function() {
		return React.createElement(
			'div',
			null,
			React.createElement(ChangeNameForm, {
				onChangeName: this.handleChangeName
			}),
			React.createElement(UserList, {
				users: this.state.users
			}),
			React.createElement(
			'div',
			{ className: 'chatbox'},
			React.createElement(UserTypingList, {
				userstyping: this.state.userstyping
			}),
			React.createElement(MessageList, {
				messages: this.state.messages
			}),
			React.createElement(MessageForm, {
				onMessageSubmit: this.handleMessageSubmit,
				onUserTyping: this.handleUserTypingJoin,
				onUserTypeStop: this.handleUserTypingLeft,
				user: this.state.user
			})
			)
		);
	}
});

ReactDOM.render(React.createElement(ChatApp, null), document.getElementById('chat'));
