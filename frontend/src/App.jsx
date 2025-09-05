import { useState, useEffect } from "react";
import { userAPI, postAPI, healthCheck } from "./api";

function App() {
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [apiStatus, setApiStatus] = useState("checking...");
  const [loading, setLoading] = useState(false);

  // Check API health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await healthCheck();
        setApiStatus("connected");
        loadData();
      } catch (error) {
        setApiStatus("disconnected");
      }
    };
    checkHealth();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersResponse, postsResponse] = await Promise.all([
        userAPI.getAll(),
        postAPI.getAll(),
      ]);
      setUsers(usersResponse.data);
      setPosts(postsResponse.data);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createSampleUser = async () => {
    try {
      const userData = {
        name: `User ${users.length + 1}`,
        email: `user${users.length + 1}@example.com`,
      };
      await userAPI.create(userData);
      loadData(); // Reload data after creating user
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">MERN Stack App</h1>
          <p className="text-xl text-gray-300 mb-4">
            Built with Vite + React + Tailwind CSS + Express + PostgreSQL +
            Prisma
          </p>
          <div className="flex justify-center items-center space-x-2">
            <span className="text-sm text-gray-300">API Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                apiStatus === "connected"
                  ? "bg-green-500 text-white"
                  : apiStatus === "disconnected"
                  ? "bg-red-500 text-white"
                  : "bg-yellow-500 text-black"
              }`}
            >
              {apiStatus}
            </span>
          </div>
        </header>

        <main className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-white mb-4">
                Welcome to Your MERN Application
              </h2>
              <p className="text-gray-300 mb-6">
                This is a modern full-stack application with a beautiful UI
              </p>

              <div className="flex justify-center items-center space-x-4 mb-6">
                <button
                  onClick={() => setCount(count - 1)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-white bg-white/20 px-6 py-2 rounded-lg">
                  {count}
                </span>
                <button
                  onClick={() => setCount(count + 1)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  +
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Frontend
                  </h3>
                  <p className="text-gray-300">React + Vite + Tailwind CSS</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Backend
                  </h3>
                  <p className="text-gray-300">Express.js + Node.js</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Database
                  </h3>
                  <p className="text-gray-300">PostgreSQL + Prisma</p>
                </div>
              </div>
            </div>
          </div>

          {/* Database Demo Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Users Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-white">Users</h3>
                <button
                  onClick={createSampleUser}
                  disabled={apiStatus !== "connected"}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Add User
                </button>
              </div>
              {loading ? (
                <div className="text-center text-gray-300">Loading...</div>
              ) : users.length > 0 ? (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white/5 p-3 rounded border border-white/10"
                    >
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-gray-300 text-sm">{user.email}</div>
                      <div className="text-gray-400 text-xs">
                        Posts: {user.posts?.length || 0}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-300">
                  {apiStatus === "connected"
                    ? "No users yet. Add one!"
                    : "Connect to API to see users"}
                </div>
              )}
            </div>

            {/* Posts Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl">
              <h3 className="text-2xl font-semibold text-white mb-4">Posts</h3>
              {loading ? (
                <div className="text-center text-gray-300">Loading...</div>
              ) : posts.length > 0 ? (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white/5 p-3 rounded border border-white/10"
                    >
                      <div className="text-white font-medium">{post.title}</div>
                      <div className="text-gray-300 text-sm">
                        {post.content}
                      </div>
                      <div className="text-gray-400 text-xs">
                        By: {post.author?.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-300">
                  {apiStatus === "connected"
                    ? "No posts yet."
                    : "Connect to API to see posts"}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
