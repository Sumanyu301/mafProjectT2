import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import AuthForm from "../components/AuthForm";
import { authAPI } from "../services/authAPI";
import { ArrowLeft, CheckCircle, Users, Shield, Zap } from "lucide-react";

function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authAPI.signup(data);
      console.log("Signup success:", res);

      // Navigate after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Users, text: "Join our growing community" },
    { icon: Shield, text: "Enterprise-grade security" },
    { icon: Zap, text: "Lightning-fast performance" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-32 right-10 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Features */}
        <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-16">
          <div className="max-w-lg mx-auto lg:mx-0">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Join the
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Future</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Create your account today and unlock a world of possibilities. 
              Experience innovation like never before.
            </p>

            {/* Feature list */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 text-gray-300">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 lg:gap-8">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="lg:w-1/2 flex flex-col items-center justify-center p-4 lg:p-8">
          <AuthForm 
            title="Signup" 
            onSubmit={handleSignup} 
            buttonText="Create Account" 
            isLoading={isLoading}
            error={error}
          />

          {/* Bottom section */}
          <div className="mt-8 text-center">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-gray-300">Already have an account?</span>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Welcome back! Sign in to continue your journey with us.
              </p>

              <Link 
                to="/login" 
                className="inline-flex items-center justify-center w-full bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] border border-white/20 hover:border-white/30 group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span>Sign In Instead</span>
              </Link>
            </div>

            {/* Footer links */}
            <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
              <button className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </button>
              <span className="text-gray-600">•</span>
              <button className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </button>
              <span className="text-gray-600">•</span>
              <button className="text-gray-400 hover:text-white transition-colors">
                Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
