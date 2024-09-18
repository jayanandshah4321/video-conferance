import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

export default function Video() {
    const [socket, setSocket] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [peers, setPeers] = useState([]);  // Store all peer connections
    const localVideoRef = useRef(null);
    const { roomId } = useParams();
    
    const peerConnections = useRef({});  // Store all peer connections
    const remoteStreamsRef = useRef([]);  // Store all remote streams

    // Get local media (camera and microphone)
    useEffect(() => {
        async function getMedia() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error('Error accessing media devices:', err);
            }
        }
        getMedia();
    }, []);

    useEffect(() => {
        if (localStream) {
            const socketInstance = io('http://localhost:3000');  // Adjust for your backend URL
            setSocket(socketInstance);

            // Join the room
            socketInstance.emit('join-room', roomId);

            // When a new user connects
            socketInstance.on('user-connected', async (userId) => {
                const peer = createPeer(userId, socketInstance.id, localStream);
                peerConnections.current[userId] = peer;  // Save the peer connection
                setPeers((prevPeers) => [...prevPeers, peer]);  // Add to peers list
            });

            // When a user disconnects
            socketInstance.on('user-disconnected', (userId) => {
                if (peerConnections.current[userId]) {
                    peerConnections.current[userId].close();
                    delete peerConnections.current[userId];
                    setPeers((prevPeers) => prevPeers.filter(peer => peer.peerId !== userId));
                }
            });

            // Receive an offer from another user
            socketInstance.on('offer', async (offer, userId) => {
                const peer = addPeer(offer, userId, localStream);
                peerConnections.current[userId] = peer;
                setPeers((prevPeers) => [...prevPeers, peer]);
            });

            // Receive an answer from the peer
            socketInstance.on('answer', (answer, userId) => {
                const peer = peerConnections.current[userId];
                peer.setRemoteDescription(new RTCSessionDescription(answer));
            });

            // Receive ICE candidates
            socketInstance.on('ice-candidate', (candidate, userId) => {
                const peer = peerConnections.current[userId];
                peer.addIceCandidate(new RTCIceCandidate(candidate));
            });

            return () => {
                socketInstance.disconnect();
                Object.values(peerConnections.current).forEach(peer => peer.close());
            };
        }
    }, [localStream, roomId]);

    // Create a new peer (initiator) and send an offer
    const createPeer = (userToSignal, callerID, stream) => {
        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', event.candidate, userToSignal);
            }
        };

        peer.ontrack = (event) => {
            handleRemoteStream(event.streams[0]);
        };

        stream.getTracks().forEach(track => {
            peer.addTrack(track, stream);
        });

        peer.createOffer().then(offer => {
            peer.setLocalDescription(offer);
            socket.emit('offer', offer, userToSignal);
        });

        return peer;
    };

    // Add peer (when receiving an offer)
    const addPeer = (incomingOffer, callerID, stream) => {
        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', event.candidate, callerID);
            }
        };

        peer.ontrack = (event) => {
            handleRemoteStream(event.streams[0]);
        };

        stream.getTracks().forEach(track => {
            peer.addTrack(track, stream);
        });

        peer.setRemoteDescription(new RTCSessionDescription(incomingOffer)).then(() => {
            peer.createAnswer().then(answer => {
                peer.setLocalDescription(answer);
                socket.emit('answer', answer, callerID);
            });
        });

        return peer;
    };

    // Handle remote streams by dynamically creating video elements
    const handleRemoteStream = (stream) => {
        if (!remoteStreamsRef.current.includes(stream)) {
            remoteStreamsRef.current.push(stream);
            const videoElement = document.createElement('video');
            videoElement.srcObject = stream;
            videoElement.autoplay = true;
            videoElement.playsInline = true;
            document.getElementById('remote-videos').append(videoElement);
        }
    };

    return (
        <>
            <div>
                <video ref={localVideoRef} autoPlay muted playsInline />
            </div>
            <div id="remote-videos">
                {/* Dynamic video elements for remote streams will be appended here */}
            </div>
        </>
    );
}
