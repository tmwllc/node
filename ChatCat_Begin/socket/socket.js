module.exports = function(io) {
	var chatRooms = io.of('/roomlist').on('connection', function(socket) {
		console.log('Connection Established on the Server!');
	});
};