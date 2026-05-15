import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Sidebar from "../components/Sidebar";

const User = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard"); // Khai báo Tab
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkIfMobile = () => setSidebarOpen(window.innerWidth >= 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    // ... (Giữ nguyên logic CheckAuth như code cũ của bạn) ...
    const storedUserId = localStorage.getItem("roadVisionUserId");
    const storedUserName = localStorage.getItem("roadVisionUserName");
    setUserId(storedUserId);
    setUsername(storedUserName || "User");
    setLoading(false);
  }, []);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {sidebarOpen && (
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userName={username} userId={userId} />
      )}
      
      {/* Bỏ class px-8 py-8 đi để Dashboard tràn màn hình khớp với code cũ */}
      <div className={`flex-1 transition-all ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Dashboard activeTab={activeTab} /> 
      </div>
    </div>
  );
};

export default User;