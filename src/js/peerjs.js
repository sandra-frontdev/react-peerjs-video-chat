import peerjs from 'peerjs';

export const peer = new peerjs({
	host: "localhost",
	port: 443,
	path: "/peerjs",
	secure: true
});