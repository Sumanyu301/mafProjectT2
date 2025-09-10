import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/authAPI";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-900 text-white">
      <h1 className="text-lg font-bold">Project Management</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition-colors"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
