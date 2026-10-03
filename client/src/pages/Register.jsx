import {useState} from "react";
import api from "../api/axios.js";
function Register(){
	const [name,setName] = useState("");
	const [email,setEmail]=useState("");
	const [password,setPassword]=useState("");

	const [loading,setLoading]=useState(false);
	const [success,setSuccess]=useState("");
	const [error,setError] = useState("");
	const handleSubmit = async(e)=>{
		e.preventDefault();
		setLoading(true);
		setSuccess("");
		setError("");
		try{
			const response = await api.post("/api/auth/register",{
			name,email,password});
			setSuccess(response.data.message || "Registration Successful");
			setName("");
			setEmail("");
			setPassword("");
		}
		catch(err){
			setError(err.response?.data?.message || "Registration failed. Try again.");
		}
		finally{
			setLoading(false);
		}
	};
	return (
		<div>
			<h2>Create Account</h2>
			<form onSubmit = {handleSubmit}>
				<input type="text" value={name} onChange = {(e)=>setName(e.target.value)} placeholder = "Enter name" required/>
				<input type="email" value={email} onChange = {(e)=>setEmail(e.target.value)} placeholder = "Enter email" required/>
				<input type="password" value={password} onChange = {(e)=>setPassword(e.target.value)} placeholder = "Enter password" required/>
				<button type="submit" disabled={loading}>
					{loading?"Registering..." : "Register"}
				</button>
			</form>
			{success && <p>{success}</p>}
      			{error && <p>{error}</p>}
		</div>
	);
}

export default Register;