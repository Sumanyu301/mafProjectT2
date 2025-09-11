import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import AuthForm from "../components/AuthForm";
import { authAPI } from "../services/authAPI";
import { ArrowRight, Sparkles } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      await authAPI.login(data); // backend sets cookie
      navigate("/"); // redirect to projects page
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Minimal background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-50 rounded-full opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-red-50 rounded-full opacity-60"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-blue-100 rounded-full opacity-40"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Main auth form */}
        <AuthForm 
          title="Login" 
          onSubmit={handleLogin} 
          buttonText={isLoading ? "Logging In..." : "Log In"}
          isLoading={isLoading}
        />
        {error && <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>}

        {/* Enhanced bottom section */}
        <div className="mt-8 text-center">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md shadow-sm">
            <div className="flex items-center justify-center mb-3">
              <Sparkles className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-blue-900 font-semibold">New to our platform?</span>
            </div>

            <p className="text-gray-700 text-sm mb-4">
              Join thousands of users and discover amazing features waiting for you.
            </p>

            <Link 
              to="/signup" 
              className="inline-flex items-center justify-center w-full bg-blue-900 hover:bg-blue-800 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-sm hover:shadow-md group"
            >
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Footer links */}
          <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
            <Link to="/privacy" className="text-gray-600 hover:text-blue-900 transition-colors font-medium">
              Privacy Policy
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/terms" className="text-gray-600 hover:text-blue-900 transition-colors font-medium">
              Terms of Service
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/help" className="text-gray-600 hover:text-blue-900 transition-colors font-medium">
              Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

// Login.jsx
// import { useNavigate, Link } from "react-router-dom";
// import { useState } from "react";
// import AuthForm from "../components/AuthForm";
// import { authAPI } from "../services/authAPI";
// import { ArrowRight, Sparkles } from "lucide-react";

// function Login() {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

// const handleLogin = async (data) => {
//   setIsLoading(true);
//   setError("");
//   try {
//     await authAPI.login(data); // backend sets cookie
//     navigate("/projects"); // redirect to projects page
//   } catch (err) {
//     setError(err.response?.data?.message || err.message || "Login failed");
//   } finally {
//     setIsLoading(false);
//   }
// };


//   return (
//     <div className="min-h-screen bg-white relative overflow-hidden">
//       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
//         <AuthForm
//           title="Login"
//           onSubmit={handleLogin}
//           buttonText={isLoading ? "Signing In..." : "Sign In"}
//           isLoading={isLoading}
//         />
//         {error && <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>}
//       </div>
//     </div>
//   );
// }

// export default Login;
