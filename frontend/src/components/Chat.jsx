import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

    useEffect(() => {
        const socket = io('http://localhost:3000');
        setSocket(socket);

        socket.on('connect', () => {
            console.log('Connected to server with socketid ' + socket.id);
        });

        socket.on('receiveMessage', (message) => {
            setChat((prevChat) => [...prevChat, message]);
        });

        return () => {
            socket.disconnect();
            console.log('Disconnected from server');
        };
    }, []);

    const sendMessage = () => {
        if (message.trim() !== '') {
            socket.emit('sendMessage', message);
            setMessage('');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-semibold text-center mb-6">Chat Section</h1>

                <div className="chat-window mb-4 h-64 overflow-y-auto border border-gray-300 rounded p-4">
                    {chat.map((msg, index) => (
                        <div key={index} className="mb-2 text-gray-700">
                            {msg}
                        </div>
                    ))}
                </div>

                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') sendMessage();
                    }}
                    placeholder="Type your message here..."
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                <button 
                    onClick={sendMessage} 
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
