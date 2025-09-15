import { useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// ✅ InputField now receives everything from props
const InputField = ({
  icon: Icon,
  type,
  name,
  placeholder,
  value,
  required = true,
  error,
  handleChange,
  showPassword,
  setShowPassword,
}) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
      <Icon
        className={`h-5 w-5 transition-colors ${
          error
            ? "text-red-500"
            : "text-gray-500 group-focus-within:text-blue-900"
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
        error
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
    {error && (
      <div className="flex items-center mt-1 text-red-600 text-sm">
        <AlertCircle className="h-4 w-4 mr-1" />
        {error}
      </div>
    )}
  </div>
);

function AuthForm({ title, onSubmit, buttonText, isLoading }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    identifier: "",
    password: "",
  });
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
      else if (form.username.length < 3)
        newErrors.username = "Username must be at least 3 characters";

      if (!form.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email))
        newErrors.email = "Please enter a valid email";
    } else {
      if (!form.identifier.trim())
        newErrors.identifier = "Email or Username is required";
    }

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim all form fields except password
    const trimmedForm = {};
    for (const key in form) {
      if (key === "password") {
        trimmedForm[key] = form[key]; // leave password as-is
      } else {
        trimmedForm[key] = form[key].trim();
      }
    }
    setForm(trimmedForm);

    if (!validateForm()) return;

    setSuccessMessage("");

    try {
      if (title === "Login") {
        const loginData = {
          identifier: trimmedForm.identifier,
          password: trimmedForm.password,  // use trimmedForm.password directly
        };
        await onSubmit(loginData);
      } else {
        await onSubmit(trimmedForm);
        setSuccessMessage(
          "Account created successfully! Redirecting to login..."
        );
      }
    } catch (err) {
      setErrors({
        submit: err.message || "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-lg p-8 transform hover:scale-[1.01] transition-all duration-300">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <img
              src="/maf_logo-removebg-preview.png"
              className="h-20 w-30 text-white"
            />
          </div>
          <h2 className="text-3xl font-bold text-blue-900 mb-2">{title}</h2>
          <p className="text-gray-600">
            {title === "Login"
              ? "Welcome back! Please enter your details."
              : "Create your account to get started."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {title === "Signup" && (
            <InputField
              icon={User}
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              handleChange={handleChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              error={errors.username}
            />
          )}

          {title === "Signup" && (
            <InputField
              icon={Mail}
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              handleChange={handleChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              error={errors.email}
            />
          )}

          {title === "Login" && (
            <InputField
              icon={Mail}
              type="text"
              name="identifier"
              placeholder="Email or Username"
              value={form.identifier}
              handleChange={handleChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              error={errors.identifier}
            />
          )}

          <InputField
            icon={Lock}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            handleChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            error={errors.password}
          />

          {errors.submit && (
            <div className="mt-1 flex items-center px-2 py-1 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              {errors.submit}
            </div>
          )}

          {successMessage && (
            <div className="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              {successMessage}
            </div>
          )}

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
      </div>
    </div>
  );
}

export default AuthForm;
