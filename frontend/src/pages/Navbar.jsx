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
      navigate("/login");
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

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-900 text-white">
    <div
      onClick={() => navigate("/")}
      className="flex justify-center cursor-pointer"
    >
      <img
        src="src/assets/mafLogo-bgremoved.png"
        className="h-20 w-30 text-white"
      />
      <h1 className="text-2xl pt-6 font-bold">Project Allocation Portal</h1>
    </div>

      <div className="flex items-center space-x-3">
        {/* User Avatar / Initials */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-700 text-white font-semibold hover:bg-blue-600 transition-all"
        >
          {getInitials() || "??"}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
