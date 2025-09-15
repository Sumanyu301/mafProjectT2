import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/authAPI";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const verifiedUser = await authAPI.verify(); // returns {id, email, role}
        setUser(verifiedUser);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  // Generate initials from email or username
  const getInitials = () => {
    if (!user) return "";
    // Take first letters of username or email before "@"
    const name = user.username || user.email || "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2); // Max 2 letters
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center p-4 justify-between cursor-pointer">
        {/* Logo and Title */}
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center cursor-pointer"
        >
          <img
            src="/mafLogo-bgremoved.png"
            className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20"
            alt="Logo"
          />
          <span className="hidden sm:block text-2xl sm:text-3xl font-bold">
            Project Allocation Portal
          </span>
        </div>

        {/* Profile Icon - always visible, right-aligned on desktop */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-blue-700 text-white font-semibold hover:bg-blue-600 transition-all text-sm sm:text-xl"
        >
          {getInitials() || "??"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
