import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate=useNavigate();
    const handleName = (e) => {
        setUsername(e.target.value);
    };

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        console.log("submitted");
        e.preventDefault();
        if (username === '' || email === '' || password === '' || confirmPassword === '' ) {
            
                setError(true);
                toast.warning("Fill all credentials", { autoClose: 10000 });
                return;
        } 
        else if(password!==confirmPassword)
        {
                setError(true);
                toast.warning("Password and Confirm Password should be same", { autoClose: 10000 });
                return;
        }
        else {
            const data = {
                name: username,
                email: email,
                password: password,
            };
            axios.post("http://localhost:3000/api/register", data)
            .then((res)=>{
                console.log(res);
                toast.success((res.data.message), { autoClose: 3000 });
                setError(false);
                setSubmitted(true);
                setConfirmPassword('');
                setEmail('');
                setPassword('');
                setUsername('');
                setTimeout(() => {
                    navigate('/login');  // Redirect to login page
                }, 2000);
            })
            .catch((err)=>{
                if(err.response){
                    toast.error(err.response.data.message || "An error occurred", { autoClose: 5000 });
                }
            })

        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-50 max-w-sm">
                <h3 className="text-xl font-bold mb-4 text-center">
                    Hi! Explore a new world
                </h3>
                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                    <TextField
                        id="outlined-username"
                        label="User Name"
                        variant="outlined"
                        value={username}
                        onChange={handleName}
                    />
                    <TextField
                        id="outlined-email"
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={handleEmail}
                    />
                    <TextField
                        id="outlined-password"
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={handlePassword}
                    />
                    <TextField
                        id="outlined-confirm-password"
                        label="Confirm Password"
                        variant="outlined"
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPassword}
                    />
                    <Button variant="contained" type="submit" endIcon={<SendIcon />} className="mt-4">
                        Register
                    </Button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Register;
