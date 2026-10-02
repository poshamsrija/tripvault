const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { loginUser } = require("../controllers/authLoginController");

router.post("/login", loginUser);
router.get("/me",authMiddleware,(req,res)=>{
	res.status(200).json({
		user:req.user
	});
});
module.exports = router;