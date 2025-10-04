import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Primary color for buttons/accents
const PRIMARY_COLOR = 'indigo'; 

const Signup = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/signup", form);
      console.log(res.data)
      localStorage.setItem("token", res.data.token); 
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/")
    } catch (err) {
      alert("Signup failed: " + err.response?.data?.message || err.message);
    }
  };

  return (
    // Outer container to center the form and apply full screen styles
    // Assuming the radial-gradient background is applied to a parent component (e.g., App.jsx or main layout)
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-100">
      <div 
        className="w-full max-w-md p-8 space-y-6 rounded-xl shadow-2xl"
        // Dark card background color, slightly lighter than the deepest background color
        style={{ backgroundColor: '#181829' }} 
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Create Your Account
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input 
            name="username" 
            placeholder="Username" 
            onChange={handleChange} 
            className="w-full p-3 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition duration-300"
            required
          />
          
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            onChange={handleChange} 
            className="w-full p-3 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition duration-300"
            required
          />
          
          <button 
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold text-white bg-${PRIMARY_COLOR}-600 hover:bg-${PRIMARY_COLOR}-700 focus:outline-none focus:ring-2 focus:ring-${PRIMARY_COLOR}-500 focus:ring-offset-2 focus:ring-offset-[#181829] transition duration-300 shadow-md`}
          >
            Sign Up
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-700">
          <p className="text-gray-400 mb-2">
            Already have an account?
          </p>
          <button
            onClick={handleLogin}
            className={`text-${PRIMARY_COLOR}-400 hover:text-${PRIMARY_COLOR}-300 font-medium transition duration-300`}
          >
            Log in here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;