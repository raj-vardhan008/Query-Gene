const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const JWT=require('jsonwebtoken');
const cookie=require('cookie');

// model

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username is Required']
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minLength:[6,'Password length Should be 6 character Long']
    },
    CustomerId:{
        type:String,
        default:""
    },
    subscription:{
        type:String,
        default:""
    },

});

// hashed password
userSchema.pre('save',async function(next){
    // for update password
    if(!this.isModified("password")){
        next()
    }

    const salt=await bcrypt.getSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();
});


// match password
userSchema.methods.matchPassword=async function(password){
    return await bcrypt.compare(password, this.password)
};

// sign token
userSchema.method.getSignedtoken = function(res){
    const accessToken=JWT.sign({id:this_id},process.env.JWT_Access_Secret,{expiresIn:JWT_ACCESS_EXPIREIN});

    const refreshToken= JWT.sign({id:this._id}, process.env.JWT_REFRESH_TOKEN, {expireIN:process.envJWT_REFRESH_EXPIREIN});

    res.cookie('refreshToken',  `${refreshtoken}`, {maxAge:86400 * 7000, httpOnly:true});
}
const User=mongoose.model('User',userSchema);

module.exports=User;
