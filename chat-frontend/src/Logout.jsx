import { useNavigate } from "react-router-dom";

// Primary color for buttons/accents (Indigo, consistent with other pages)
const PRIMARY_COLOR = 'indigo'; 

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); 
  };

  return (
    // Outer container to center the button on the screen
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-100">
      <div 
        className="w-full max-w-sm p-8 space-y-8 rounded-xl shadow-2xl text-center"
        // Dark card background color, consistent with Login/Signup
        style={{ backgroundColor: '#181829' }} 
      >
        <h1 className="text-2xl font-semibold text-white">
          Ready to log out?
        </h1>
        
        <button 
          onClick={handleLogout}
          className="w-full py-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#181829] transition duration-300 shadow-md"
        >
          Logout
        </button>
        
        <button
            onClick={() => navigate('/')}
            className={`mt-4 text-${PRIMARY_COLOR}-400 hover:text-${PRIMARY_COLOR}-300 font-medium transition duration-300`}
        >
            Cancel and Go Back to Chat
        </button>
      </div>
    </div>
  );
};

export default Logout;