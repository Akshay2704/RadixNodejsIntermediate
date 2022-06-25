require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./../models/users");
const auth = require("./../middleware/auth");
const res = require("express/lib/response");
const { registerValidation, loginValidation } = require("../validation");

function generateAccessToken(data) {
    return jwt.sign(data, process.env.TOKEN_KEY, {expiresIn: "24h"}) 
};

exports.signup = async(req,res) => {
    try {
        const { error } = registerValidation(req.body);
    	if (error) return res.status(400).send(error.details[0].message);
        const { userName, email, password } = req.body;
        const oldUser = await User.findOne({email});

        if (oldUser){
            return res.status(409).send("User already exist. Please Signin");
        }

        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            userName,
            email: email.toLowerCase(),
            password: encryptedPassword
        });
        delete user._id;
        res.status(201).json(user);
    }catch (err){
        console.log(err);
    }
}

exports.signin =async(req, res) => {
    try{
        const { error } = loginValidation(req.body);
	    if (error) return res.status(400).send(error.details[0].message);
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if (user && (await bcrypt.compare(password, user.password))) {
            const data = {
                userId: user._id, 
                email : user.email
            }
            const access = generateAccessToken({data : data})
            user.accessToken = access;
            return res.status(200).json({user});
        }
        res.status(400).send("Invalid Credantial");
    }catch (err){
        console.log(err);
    }
}