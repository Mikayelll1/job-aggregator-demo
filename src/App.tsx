import { Routes, Route } from "react-router-dom"; 
import MainPage from '../src/pages/MainPage';
import Navbar from '../src/components/Navbar';
import ResumeAnalyser from '../src/pages/Resume-Analysis';
import Profile from '../src/pages/Profile';
import AuthPage from '../src/pages/Login';
import Jobs from '../src/pages/Jobs';
import { UserProvider } from "../src/components/User";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const App = () => {
  return(
    <>
    <UserProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/resume-analyser" element={<ResumeAnalyser />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<AuthPage />} />
        {/* Add more routes as needed */}
        </Routes>
    </UserProvider>
    </>
    );
  };

export default App
