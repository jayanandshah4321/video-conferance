import React, { useCallback, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import videopht from '../assets/videopht.webp';
import {useSocket} from '../context/SocketProvider';

const Meetingform = () => {
    const [room, setMeetingCode] = useState('');
    const [email, setName] = useState('');
    const navigate = useNavigate();
    const socket = useSocket();
    console.log(socket);

    const handleCode = (e) => {
        setMeetingCode(e.target.value);
    };

    const handleName = (e) => {
        setName(e.target.value);
    };

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        console.log("Form submitted");
        setMeetingCode('');
        setName('');
        console.log(room,email);
        socket.emit("room:join", {email,room});
        // Test navigation directly
        navigate(`/room/${room}`);
    }, [socket, room, email, navigate]);
    

    const handleJoinRoom = useCallback(
        (data) => {
            console.log("Inside handleJoinRoom");
            console.log("Received data:", data);
            const { email, room } = data;
            console.log("Navigating to room:", room);
            navigate(`/room/${room}`);
        },
        [navigate]
    );
    
    useEffect(() => {
        console.log("Setting up socket event listener");
        socket.on("room:join", handleJoinRoom);
        return () => {
            console.log("Cleaning up socket event listener");
            socket.off("room:join", handleJoinRoom);
        };
    }, [socket, handleJoinRoom]);
    

    return (
        <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
                    Providing Best Quality Video Call
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <p className="text-gray-600">Enter the code of the meeting:</p>
                    <TextField
                        id="outlined-meeting-code"
                        label="Meeting Code"
                        variant="outlined"
                        value={room}
                        onChange={handleCode}
                        className="w-full"
                    />
                    <p className="text-gray-600 mt-4">Enter Name:</p>
                    <TextField
                        id="outlined-name"
                        label="Name"
                        variant="outlined"
                        value={email}
                        onChange={handleName}
                        className="w-full"
                    />
                    <Button variant="contained" type="submit" endIcon={<SendIcon />} className="mt-6">
                        Get in
                    </Button>
                </form>
            </div>
            <picture className="w-full max-w-lg mt-10 md:mt-0 md:ml-10">
                <source srcSet={videopht} type="image/webp" />
                <img src={videopht} alt="Video Call Illustration" className="rounded-lg shadow-lg w-full" />
            </picture>
            <ToastContainer />
        </div>
    );
};

export default Meetingform;
