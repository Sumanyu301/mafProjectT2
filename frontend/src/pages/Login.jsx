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
      const res = await authAPI.login(data);

      // Save token/user in localStorage
      localStorage.setItem("token", res.token);
      if (res.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
      }

      // Navigate to dashboard
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Main auth form */}
        <AuthForm 
          title="Login" 
          onSubmit={handleLogin} 
          buttonText={isLoading ? "Signing In..." : "Sign In"}
          isLoading={isLoading}
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        {/* Enhanced bottom section */}
        <div className="mt-8 text-center">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md">
            <div className="flex items-center justify-center mb-3">
              <Sparkles className="h-5 w-5 text-yellow-400 mr-2 animate-pulse" />
              <span className="text-gray-300">New to our platform?</span>
            </div>

            <p className="text-gray-400 text-sm mb-4">
              Join thousands of users and discover amazing features waiting for you.
            </p>

            <Link 
              to="/signup" 
              className="inline-flex items-center justify-center w-full bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] border border-white/20 hover:border-white/30 group"
            >
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Footer links */}
          <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-600">•</span>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span className="text-gray-600">•</span>
            <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
              Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
