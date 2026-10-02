const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const loginUser = async(req,res)=>{
	try{
		const {email,password} = req.body;
		if(!email || !password){
			return res.status(400).json({
				message:"Email and password are required"
			});
		}
		const user = await User.findOne({email});
		if(!user){
			return res.status(401).json({
				message:"Invalid email or password"
			});
		}
		const isPasswordCorrect = await bcrypt.compare(password,user.password);
		if(!isPasswordCorrect){
			return res.status(401).json({
				message:"Invalid email or password"
			});
		}
		const token = await jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
		return res.status(200).json({
			message: "Login successful",
			token,
            		user: {
                		id: user._id,
                		name: user.name,
                		email: user.email
            		}
        	});
	}
	catch(error){
		console.error("Login error:", error);
		return res.status(500).json({
			message:"Server error"
		});
	}
}
module.exports = {loginUser};