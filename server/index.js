const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
	res.send("Welcome to tripvault API");
});
const PORT = process.env.PORT || 5000;

const startserver = async()=>{
	await connectDB();
	app.listen(PORT,()=>{
		console.log(`server is running on port ${PORT}`);
});
};
startserver();