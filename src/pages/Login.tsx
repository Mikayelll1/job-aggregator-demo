import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../src/components/User"; // adjust if needed

function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // only for register
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const { setUser, setToken } = useContext(UserContext);
  const navigate = useNavigate();

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setError(null);
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = mode === "login" ? "/login" : "/register";
    const bodyData =
      mode === "login"
        ? { username, password }
        : { username, email, password };

    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || `${mode} failed`);
      }

      const data = await res.json();

      if (mode === "login") {
        const accessToken = data.access_token;
        localStorage.setItem("access_token", accessToken);
        setToken(accessToken);

        // Fetch profile to set user
        const profileRes = await fetch(`${apiUrl}/profile`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!profileRes.ok) {
          throw new Error("Failed to fetch user profile.");
        }

        const profileData = await profileRes.json();
        setUser({ username: profileData.username });

        alert("Login successful!");
        navigate("/");
      } else {
        alert("Registration successful! Please login.");
        toggleMode();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl shadow-2xl min-h-[80vh] min-w-[90vw] bg-gray-100 pt-32 flex justify-center items-start">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md max-w-sm w-full text-black"
      >
        <h2 className="text-2xl mb-4 capitalize">{mode}</h2>
        {error && (
          <div className="mb-4 text-red-600 font-semibold">{error}</div>
        )}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-3 w-full px-3 py-2 border rounded"
          required
        />
        {mode === "register" && (
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3 w-full px-3 py-2 border rounded"
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 w-full px-3 py-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          {loading
            ? mode === "login"
              ? "Logging in..."
              : "Registering..."
            : mode === "login"
            ? "Login"
            : "Register"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-600 hover:underline font-semibold"
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default AuthPage;
