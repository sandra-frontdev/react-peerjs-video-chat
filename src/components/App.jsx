import React, { useState, useEffect, useRef } from 'react';
import { peer } from '../js/peerjs';

const App = () => {
	// Setting up state
	const [peerId, setPeerId] = useState("");
	const [secondId, setSecondId] = useState("");

	// Defining refs
	const coreVideo = useRef();
	const peerVideo = useRef();

	useEffect(() => {
		// Specify what is happening when peer is open
		peer.on('open', id => {
			setPeerId(id);
		});

		// Is our user granting media permissions
		const mediaPermission = () => { 
			return (navigator.getUserMedia || navigator.webkitGetUserMedia || 
				 navigator.mozGetUserMedia); 
		} 

		if(mediaPermission()) {
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
			|| navigator.mozGetUserMedia; 

			peer.on('call', async call => {
				const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video:true
				});

				call.answer(stream);

				call.on('stream', remoteStream => {
					coreVideo.current.srcObject = stream;
					peerVideo.current.srcObject = remoteStream;
				});
			});
		} else {
			alert('Peerjs is not supported, maybe you should try to run peer server!')
		}
	});

	// Specify what is happending on button click
	const onBtnClick = async (e) => {
		const mediaPermission = () => { 
			return (navigator.getUserMedia || navigator.webkitGetUserMedia || 
				 navigator.mozGetUserMedia); 
		} 
		if(mediaPermission()) {
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
			|| navigator.mozGetUserMedia; 

			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true
			 });
		
			 // Set up what is happening on peer call
			 let call = peer.call(secondId, stream);
			 call.on('stream', async remoteStream => {
				coreVideo.current.srcObject = stream;
				peerVideo.current.srcObject = remoteStream;
			});
		} else { 
			alert("Peerjs is not supported, maybe you should try to run peer server!"); 
		}
	}

	return (
		<div className="streaming-container">
			<div className="streaming__title">
			<input onChange={(e) => {
				e.preventDefault()
				setSecondId(e.target.value);
			}} value={secondId}/>
			<button className="streaming__button" onClick={onBtnClick}>Call</button>
				<h1>Peer ID: {peerId}</h1>
			</div>
			<div className="streaming__videos">
				<video ref={coreVideo} id="video" width="500px" height="500px" autoPlay></video>
				<video ref={peerVideo} id="local" width="200px" height="200px" autoPlay></video>
			</div>
		</div>
	);
};

export default App;

