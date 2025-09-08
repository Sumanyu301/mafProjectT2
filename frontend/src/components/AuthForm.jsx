import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";

function AuthForm({ title, onSubmit, buttonText, isLoading }) {
  const [form, setForm] = useState({ username: "", email: "", identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (title === "Signup") {
      if (!form.username.trim()) newErrors.username = "Username is required";
      else if (form.username.length < 3) newErrors.username = "Username must be at least 3 characters";

      if (!form.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Please enter a valid email";
    } else {
      if (!form.identifier.trim()) newErrors.identifier = "Email or Username is required";
    }

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSuccessMessage("");

    try {
      if (title === "Login") {
        const loginData = {
          identifier: form.identifier,
          password: form.password,
        };
        await onSubmit(loginData);
      } else {
        await onSubmit(form);
        setSuccessMessage("Account created successfully! Redirecting to login...");
      }
    } catch (err) {
      setErrors({ submit: err.message || "An error occurred. Please try again." });
    }
  };

  // Updated InputField with Carrefour theme
  const InputField = ({ icon: Icon, type, name, placeholder, value, required = true }) => (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <Icon
          className={`h-5 w-5 transition-colors ${
            errors[name] ? "text-red-500" : "text-gray-500 group-focus-within:text-blue-900"
          }`}
        />
      </div>
      <input
        type={type === "password" && showPassword ? "text" : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        className={`w-full pl-10 pr-12 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:scale-[1.02] placeholder-gray-500 ${
          errors[name]
            ? "bg-red-50 border-2 border-red-300 text-red-900 focus:ring-red-200 focus:border-red-500"
            : "bg-gray-50 border-2 border-gray-200 text-gray-900 focus:ring-blue-200 focus:border-blue-900 hover:border-gray-300"
        }`}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center z-10 hover:scale-110 transition-transform"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-500 hover:text-blue-900" />
          ) : (
            <Eye className="h-5 w-5 text-gray-500 hover:text-blue-900" />
          )}
        </button>
      )}
      {errors[name] && (
        <div className="flex items-center mt-1 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          {errors[name]}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative w-full max-w-md">
      {/* Clean white card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 transform hover:scale-[1.01] transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className=" flex justify-center ">
            <img src="src/assets/maf_logo-removebg-preview.png" className="h-20 w-30 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-blue-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600">
            {title === "Login"
              ? "Welcome back! Please enter your details."
              : "Create your account to get started."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {title === "Signup" && (
            <InputField icon={User} type="text" name="username" placeholder="Username" value={form.username} />
          )}

          {title === "Signup" && (
            <InputField icon={Mail} type="email" name="email" placeholder="Email address" value={form.email} />
          )}

          {title === "Login" && (
            <InputField
              icon={Mail}
              type="text"
              name="identifier"
              placeholder="Email or Username"
              value={form.identifier}
            />
          )}

          <InputField icon={Lock} type="password" name="password" placeholder="Password" value={form.password} />

          {/* Submit error */}
          {errors.submit && (
            <div className="flex items-center justify-center p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              {errors.submit}
            </div>
          )}

          {/* Success message */}
          {successMessage && (
            <div className="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              {successMessage}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{buttonText}</span>
            )}
          </button>
        </form>

        {/* Forgot password link for login */}
        {title === "Login" && (
          <div className="text-center mt-4">
            <button
              type="button"
              className="text-red-600 hover:text-red-700 text-sm transition-colors font-medium"
              onClick={() => console.log("Forgot password clicked")}
            >
              Forgot your password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthForm;