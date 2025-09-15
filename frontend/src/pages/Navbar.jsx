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

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

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
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo and Title */}
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center cursor-pointer gap-2"
        >
          <img src="/mafLogo-bgremoved.png" className="h-12 w-12" alt="Logo" />
          <span className="hidden sm:block text-2xl font-bold">
            Project Allocation Portal
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white font-semibold hover:bg-blue-600 transition-all"
          >
            {getInitials() || "??"}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800 border-t border-blue-700">
          <div className="flex flex-col items-center py-4 space-y-3">
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/profile");
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white font-semibold hover:bg-blue-600 transition-all"
            >
              {getInitials() || "??"}
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
