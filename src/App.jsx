// Import necessary React and routing libraries
import React, { useEffect } from "react";                          // Core React library with useEffect hook for side effects
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"; // React Router for navigation
import { ToastContainer, toast } from "react-toastify";            // Toast notifications library
import "react-toastify/dist/ReactToastify.css";                    // Styles for toast notifications
import { io } from "socket.io-client";                             // Socket.IO client for real-time communication

// Import all page components
import Demo from "./pages/Demo";                                   // Demo page for showcasing features
import Admin from "./pages/Admin";                                 // Admin dashboard for system management
import Navbar from './components/Navbar';                          // Navigation bar component
import Hero from './components/Hero';                              // Hero section for landing page
import ViewFeed from './pages/ViewFeed';                           // Feed view for damage reports
import Features from './components/Features';                      // Features showcase component
import Testimonials from './components/Testimonials';              // User testimonials component
import Footer from './components/Footer';                          // Footer component
import SignupPage from './pages/SignupPage';                       // User registration page
import LoginPage from './pages/LoginPage';                         // User login page
import AboutUs from './pages/AboutUs';                             // About us information page
import AuthorityPage from './pages/AuthorityPage';                 // Municipal authority dashboard
import Upload from './pages/Upload';                               // Image upload and analysis page
import User from './pages/user';                                   // User profile and dashboard
import Contact from './pages/Contact';                             // Contact form page
import Report from './pages/Report';                               // Damage reporting page
import MapView from './pages/MapView';                             // Map visualization of damage reports
import 'leaflet/dist/leaflet.css';                                 // CSS for Leaflet maps

// Setup the WebSocket connection to the backend server
const socket = io("http://localhost:5000");                        // Initialize Socket.IO connection

// HomePage component combines multiple components to create the landing page
const HomePage = () => (
  <>
    <Hero />                                                     
    <Features />  
    <Testimonials />                                                 
    <Footer />                                                     
  </>
);

const LayoutWithNavbar = ({ children }) => {
  const location = useLocation();
  // Khai báo các trang KHÔNG muốn hiện thanh Navbar phía trên
  const hideNavbar = ["/admin", "/user", "/authority"].includes(location.pathname);
  
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

// Main App component that sets up routing and global notifications
const App = () => {
  // Set up WebSocket listeners when component mounts
  useEffect(() => {
    // Listen for admin notifications about new uploads
    socket.on("admin-notification", (data) => {
      // Display toast notification when new image is uploaded
      toast.info(`New image uploaded: ${data.imagePath}`, {
        icon: "🚧",                                                // Road work icon for notifications
      });
    });

    // Clean up event listeners when component unmounts
    return () => {
      socket.off("admin-notification");                            // Remove event listener
    };
  }, []);                                                          // Empty dependency array means this runs once on mount
  
  return (
  <Router>
    <div className="bg-white text-gray-900">
      <LayoutWithNavbar>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/user" element={<User />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/authority" element={<AuthorityPage />} />
          <Route path="/report" element={<Report />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/view" element={<ViewFeed />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/demo" element={<Demo />} />
        </Routes>
      </LayoutWithNavbar>
      <ToastContainer position="bottom-right" autoClose={5000} theme="colored" />
    </div>
  </Router>
);
};

export default App;                                                // Export the App component as default
