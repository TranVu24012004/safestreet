import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaSignOutAlt, FaMap, FaImage, FaChartArea, FaAddressCard, FaTable, FaLeaf, FaUsers } from "react-icons/fa";
import { Camera } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab, userName, userId }) => {
  const navigate = useNavigate();

  // Lấy role từ localStorage thay vì check string 'admin_'
  const userRole = localStorage.getItem("roadVisionRole") || "citizen";
  
  // 1. Menu của Admin (Full quyền)
  const adminNavItems = [
    { name: "Dashboard", path: "/admin", icon: <FaHome className="text-lg" /> },
    // Đổi tên thành "Users" và đưa path về "/admin"
    { name: "Users", path: "/admin", icon: <FaUsers className="text-lg" /> }, 
    { name: "Image Uploads", path: "/authority", icon: <FaImage className="text-lg" /> },
    { name: "Map", path: "/map", icon: <FaMap className="text-lg" /> },
    { name: "View Reports", path: "/report", icon: <FaChartArea className="text-lg" /> },
    { name: "View Feedbacks", path: "/view", icon: <FaAddressCard className="text-lg" /> },
    { name: "Logout", path: "/", icon: <FaSignOutAlt className="text-lg" /> },
  ];

  // 2. Menu của Cơ quan chức năng (Giống admin nhưng KHÔNG có Manage Users)
  const authorityNavItems = [
    { name: "Dashboard", path: "/admin", icon: <FaHome className="text-lg" /> },
    { name: "Image Uploads", path: "/authority", icon: <FaImage className="text-lg" /> },
    { name: "Map", path: "/map", icon: <FaMap className="text-lg" /> },
    { name: "View Reports", path: "/report", icon: <FaChartArea className="text-lg" /> },
    { name: "View Feedbacks", path: "/view", icon: <FaAddressCard className="text-lg" /> },
    { name: "Logout", path: "/", icon: <FaSignOutAlt className="text-lg" /> },
  ];
  
  // 3. Menu của Người dân
  const citizenNavItems = [
    { name: "Dashboard", path: "/user", icon: <FaHome className="text-lg" /> },
    { name: "Camera", path: "/user", icon: <Camera className="text-lg" /> },
    { name: "History", path: "/user", icon: <FaTable className="text-lg" /> },
    { name: "Logout", path: "/", icon: <FaSignOutAlt className="text-lg" /> },
  ];
  
  // Lựa chọn menu để hiển thị
  let navItems = citizenNavItems;
  if (userRole === "admin") navItems = adminNavItems;
  else if (userRole === "authority") navItems = authorityNavItems;

  const handleTabChange = (tab) => {
    const navItem = navItems.find(item => item.name === tab);
    
    if (tab === "Logout") {
      localStorage.removeItem("roadVisionUserId");
      localStorage.removeItem("roadVisionUserName");
      localStorage.removeItem("roadVisionRole");
      localStorage.removeItem("user");
      localStorage.removeItem("roadVisionUserType");
      localStorage.removeItem("roadVisionIsAdmin");
      navigate("/");
      return;
    }
    
    // Nếu có hàm setActiveTab được truyền vào, gọi nó để đổi giao diện Tab
    if (setActiveTab) {
      setActiveTab(tab);
    }
    
    // Nếu path hiện tại khác với path của menu thì mới chuyển route
    if (navItem && navItem.path !== window.location.pathname) {
      navigate(navItem.path);
    }
  };

  const getInitial = (name) => name && name.length > 0 ? name.charAt(0).toUpperCase() : "U";

  // Hiển thị tên Role cho ngầu
  const displayRole = userRole === "admin" ? "Administrator" : userRole === "authority" ? "Authority" : "Citizen";

  return (
    <div className="w-64 min-w-[16rem] bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto z-30 border-r border-green-100">
      <div className="p-6 bg-gradient-to-b from-green-50 to-white">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
            <FaLeaf className="text-xl" />
          </div>
          <h1 className="text-green-800 font-bold text-xl">Inspectify</h1>
        </div>
        
        {userName && (
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-green-100">
            <p className="text-green-700 text-xs font-medium mb-2 uppercase tracking-wider">Current User</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-800 shadow-inner border-2 border-green-200">
                <span className="text-lg font-semibold">{getInitial(userName)}</span>
              </div>
              <div>
                <p className="text-gray-800 font-medium">{userName}</p>
                <p className="text-green-600 text-xs font-medium">{displayRole}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="px-4 py-2">
        <p className="text-xs font-medium text-green-700 uppercase tracking-wider mb-2 ml-2">Navigation</p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li
              key={item.name}
              onClick={() => handleTabChange(item.name)}
              className={`p-3 cursor-pointer flex items-center gap-3 rounded-lg transition-all ${
                activeTab === item.name 
                  ? "bg-green-600 text-white shadow-md" 
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <div className={`${activeTab === item.name ? "text-white" : "text-green-600"}`}>
                {item.icon}
              </div>
              <span className="font-medium">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;