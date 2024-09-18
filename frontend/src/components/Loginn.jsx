import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

const Loginn = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

   
    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };


    const handleSubmit = (e) => {
        console.log("submitted");
        e.preventDefault();
        if (email === '' || password === '') {
            setError(true);
            toast.warning("Fill all credentials", { autoClose: 10000 });
            return;
        } else {
            const data={
                email:email,
                password:password
            }
            axios.post("http://localhost:3000/api/login",data)
            .then((res)=>{
                console.log(res);
                toast.success((res.data.message), { autoClose: 3000 });
                setError(false);
                setSubmitted(true);
                setEmail('');
                setPassword('');
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
                    Login 
                </h3>
                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                    
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
                    
                    <Button variant="contained" type="submit" endIcon={<SendIcon />} className="mt-4">
                        Login
                    </Button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Loginn;
