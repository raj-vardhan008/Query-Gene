const errorHandler = require("../middleware/errorMiddleware");
const userModel = require("../models/userModel");
const errorResponse = require("../utils/errorResponse");

// JWT token
exports.sendToken=(user, statusCode, res ) =>{
    const token = user.getSignedToken(res);
    res.status(statuscode).json({
        success:true,
        token,
    });
};

// regisster
exports.registerController = async (req,res,next)=>{
    try{
        const {username, email, password} = req.body;

        // exisiting user
        const exisitingEmail= await userModel.findOne({email})
        if(exisitingEmail){
            return next(new errorResponse('Email is already register',500));
        }
        const user = await userModel.create({username,email,password})
        this.sendToken(user,201,res);
    } catch(error){
        console.log(error);
        next(error);
    }
};

// login
exports.logincontroller=async(req,res,next)=>{
    try{
        const {email,password} = req.body;
        
        // validation
        if(!email || !password){
            return next(new errorResponse('Please provide email or password'));
        }
        const user =await userModel.findOne({email});
        if(!user){
            return next(new errorResponse('Invalid Credintial', 401));
        }
        const isMatch = await userModel.matchPassword(password);
        if(!isMatch){
            return next(new errorHandler('Invalid Credintial', 401));
        }

        // res 
        this.sendToken(user,200,res);

    } catch (error){
        console.log(error);
        next(error);
    }
};

// logout
exports.logoutController=async(req,res)=>{
    res.clearCookie("refreshtoken");
    return res.status(200).json({
        success: true,
        message:"Logout Successfully",
    })
};