const routes= require('express').Router();
const Register=require("../controllers/Register");
const Login=require("../controllers/Login");

//redirecting
routes.post('/register',Register);
routes.post('/login',Login);

module.exports=routes;
