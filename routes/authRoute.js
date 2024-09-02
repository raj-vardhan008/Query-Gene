const express = require('express');
const { registerController, logincontroller, logoutController } = require('../controller/authController');

// router object
const router=express.Router();

// routes
// register
router.post('/register',registerController);

// login
router.post('/login',logincontroller);

// logout
router.post('logout',logoutController); 

module.exports=router;