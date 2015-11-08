'use strict';

function outputRooms(socket, rooms) {
	// broadcasts to all but active socket
	socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
	// broadcasts to active socket
	socket.emit('roomupdate', JSON.stringify(rooms));
}

module.exports = function(io, rooms) {
	io.of('/messages').on('connection', function(socket) {
		console.log('Connected to the chat room.');
		socket.on('joinroom', function(data) {
			socket.userName = data.user;
			socket.userPic = data.userPic;
			socket.join(data.room);
			updateUserList(data.room, true);
		});

		socket.on('newmessage', function(data) {
			socket.broadcast.to(data.roomNumber)
				.emit('messagefeed', JSON.stringify(data));
		});

		function updateUserList(room, updateAll) {
			var users = io.of('/messages').clients(room),
				userList = [],
				i,
				user;

			for (i = 0; i < users.length; i++) {
				user = users[i];
				userList.push({ userPic: user.userPic, userName: user.userName });
			}

			socket.to(room).emit('updateUsersList', JSON.stringify(userList));
			if (updateAll) {
				socket.broadcast.to(room).emit('updateUsersList', JSON.stringify(userList));
			}
		}

		socket.on('updateUsersList', function(data) {
			updateUserList(data.room);
		});
	});

	io.of('/roomlist').on('connection', function(socket) {
		console.log('Connection Established on the Server!');

		if (rooms.length) {
			outputRooms(socket, rooms);
		}

		socket.on('newroom', function(data) {
			// create room number here, and ensure it does not already exist?
			rooms.push(data);
			outputRooms(socket, rooms);
		});
	});
};