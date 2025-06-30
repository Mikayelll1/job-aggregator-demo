import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState<{ username: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedJobs] = useState([
    // Add example jobs or leave empty to test "No saved jobs"
    // { id: 1, title: "Frontend Developer", company: "Awesome Inc." },
    // { id: 2, title: "Backend Engineer", company: "Tech Corp" },
  ]);

  const [activeSection, setActiveSection] = useState("Profile");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("No token found.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const sections = {
    Profile: (
      <>
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <p className="text-gray-700 mb-2">
              <strong>Username:</strong> {user?.username}
            </p>
            <p className="text-gray-700 mb-6">
              <strong>Email:</strong> {user?.email || "Not provided"}
            </p>
            <p className="text-gray-700">This is your public profile. You can update your photo, name, and bio here.</p>
          </>
        )}
      </>
    ),
    Account: (
      <>
        <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
        <p className="text-gray-700">Manage your login credentials and email preferences here.</p>
      </>
    ),
    Jobs: (
      <>
        <h1 className="text-2xl font-bold mb-4">Saved Jobs</h1>
        {savedJobs.length === 0 ? (
          <p className="text-gray-700 italic">No saved jobs.</p>
        ) : (
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {savedJobs.map((job) => (
              <li key={job.id}>
                <strong>{job.title}</strong> at {job.company}
              </li>
            ))}
          </ul>
        )}
      </>
    ),
    Documents: (
      <>
        <h1 className="text-2xl font-bold mb-4">Documents</h1>
        <p className="text-gray-700">Upload or edit your resume, cover letter, and portfolio files.</p>
      </>
    ),
    Settings: (
      <>
        <h1 className="text-2xl font-bold mb-4">App Settings</h1>
        <p className="text-gray-700">Customize your experience with notifications, themes, and more.</p>
      </>
    ),
    "Delete Account": (
      <>
        <h1 className="text-2xl font-bold mb-4 text-red-600">Danger Zone</h1>
        <p className="text-gray-700">Click below to delete your account. This action is irreversible.</p>
        <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Delete My Account
        </button>
      </>
    ),
  };

  return (
    <div className="rounded-xl min-h-[80vh] min-w-[90vw] bg-gray-100 pt-32 flex justify-center items-start">
      <div className="bg-white rounded-xl shadow-lg flex w-[2000px] min-h-[800px] overflow-hidden">
        {/* Sidebar */}
        <div className="bg-gray-200 w-1/3 p-6 flex flex-col items-center gap-6">
          {/* Profile Picture */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Sidebar Navigation */}
          <ul className="w-full space-y-3">
            {Object.keys(sections).map((section) => (
              <li
                key={section}
                onClick={() => setActiveSection(section)}
                className={`font-semibold cursor-pointer px-4 py-2 rounded 
                  ${
                    activeSection === section
                      ? section === "Delete Account"
                        ? "text-white bg-red-600"
                        : "bg-blue-600 text-white"
                      : section === "Delete Account"
                      ? "text-red-600 hover:text-red-800"
                      : "text-gray-700 hover:text-black"
                  }`}
              >
                {section}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">{sections[activeSection]}</div>
      </div>
    </div>
  );
}

export default Profile;