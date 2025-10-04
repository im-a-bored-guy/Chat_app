import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./api.js";

// Primary color for buttons/accents
const PRIMARY_COLOR = 'indigo'; 

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(form); 
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed: " + err.message);
    }
  };

  return (
    // Outer container to center the form and ensure text visibility
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-100">
      <div 
        className="w-full max-w-md p-8 space-y-6 rounded-xl shadow-2xl"
        // Dark card background color, consistent with Signup page
        style={{ backgroundColor: '#181829' }} 
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Welcome Back
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            // Consistent dark styling for inputs
            className="w-full p-3 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition duration-300"
            required
          />
          
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            // Consistent dark styling for inputs
            className="w-full p-3 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition duration-300"
            required
          />
          
          <button 
            type="submit"
            // Consistent Indigo button styling
            className={`w-full py-3 rounded-lg font-semibold text-white bg-${PRIMARY_COLOR}-600 hover:bg-${PRIMARY_COLOR}-700 focus:outline-none focus:ring-2 focus:ring-${PRIMARY_COLOR}-500 focus:ring-offset-2 focus:ring-offset-[#181829] transition duration-300 shadow-md`}
          >
            Login
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-700">
          <p className="text-gray-400 mb-2">
            Don't have an account?
          </p>
          <button
            onClick={handleSignup}
            // Consistent Indigo link styling
            className={`text-${PRIMARY_COLOR}-400 hover:text-${PRIMARY_COLOR}-300 font-medium transition duration-300`}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;