const {User} = require('../models/user');
const express = require('express');

const usersRouter = express.Router();

usersRouter.get(`/`, async (req, res) =>{
    const userList = await User.find();

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
})

module.exports =usersRouter;