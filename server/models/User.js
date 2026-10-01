const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
{
name:{
type : "string",
required : true,
trim : true
},
email :{
type : "string",
required : true,
unique : true,
lowercase: true,
trim : true,
match : /^[^\s@]+@[^\s@]+\.[^\s@]+$/
},
password : {
type : "string",
required : true,
}
},
{timestamps : true}
);
module.exports = mongoose.model("User",userSchema);
