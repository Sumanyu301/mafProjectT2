import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import AuthForm from "../components/AuthForm";
import { ArrowLeft, CheckCircle, Users, Shield, Zap } from "lucide-react";

import { authAPI } from "../services/authAPI";

function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


const handleSignup = async (data) => {
  setIsLoading(true);
  setError(null);
  try {
    const res = await authAPI.signup({
      username: data.username,
      email: data.email,
      password: data.password,
    });

    console.log("Signup success:", res);

    setTimeout(() => navigate("/login"), 1500);
  } catch (err) {
    setError(err.response?.data?.message || err.message || "Signup failed");
  } finally {
    setIsLoading(false);
  }
};

  const features = [
    { icon: Users, text: "Join our growing community" },
    { icon: Shield, text: "Enterprise-grade security" },
    { icon: Zap, text: "Lightning-fast performance" },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-50 rounded-full opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-red-50 rounded-full opacity-60"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-blue-100 rounded-full opacity-40"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Features */}
        <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 bg-gray-50">
          <div className="max-w-lg mx-auto lg:mx-0">
            <h1 className="text-4xl lg:text-6xl font-bold text-blue-900 mb-6 leading-tight">
              Join the
              <span className="text-red-600"> Future</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Create your account today and unlock a world of possibilities.
              Experience innovation like never before.
            </p>

            {/* Feature list */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 text-gray-700">
                  <div className="bg-blue-900 p-2 rounded-lg">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 lg:gap-8">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-blue-900">50K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-blue-900">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-blue-900">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="lg:w-1/2 flex flex-col items-center justify-center p-4 lg:p-8 bg-white">
          <AuthForm
            title="Signup"
            onSubmit={handleSignup}
            buttonText="Create Account"
            isLoading={isLoading}
            error={error}
          />

          {/* Bottom section */}
          <div className="mt-8 text-center">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md shadow-sm">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-blue-900 font-semibold">Already have an account?</span>
              </div>

              <p className="text-gray-700 text-sm mb-4">
                Welcome back! Sign in to continue your journey with us.
              </p>

              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full bg-blue-900 hover:bg-blue-800 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-sm hover:shadow-md group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span>Sign In Instead</span>
              </Link>
            </div>

            {/* Footer links */}
            <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
              <button className="text-gray-600 hover:text-blue-900 transition-colors font-medium">
                Privacy Policy
              </button>
              <span className="text-gray-400">•</span>
              <button className="text-gray-600 hover:text-blue-900 transition-colors font-medium">
                Terms of Service
              </button>
              <span className="text-gray-400">•</span>
              <button className="text-gray-600 hover:text-blue-900 transition-colors font-medium">
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