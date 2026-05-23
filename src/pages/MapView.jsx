import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import RoadIssueMap from '../components/RoadIssueMap';
import { MapPin, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MapView = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState("Map");
  
  // Get user info from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('roadVisionUserId');
    const storedUserName = localStorage.getItem('roadVisionUserName');
    
    if (storedUserId) {
      setUserId(storedUserId);
      
      // Check if user is admin and redirect if not
      const isAdmin = storedUserId.startsWith('admin_');
      if (!isAdmin) {
        console.log("Non-admin user detected in Map component, redirecting to user dashboard");
        navigate('/user');
      }
    } else {
      // If no user ID is found, redirect to login
      console.log("No user ID found, redirecting to login");
      navigate('/');
    }
    
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, [navigate]);
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} userName={userName} userId={userId} />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-blue-500 mr-2" />
                <h1 className="text-xl font-semibold text-gray-900">Bản đồ sự cố đường</h1>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-[calc(100vh-12rem)]">
              <RoadIssueMap />
            </div>
            
            <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Giới thiệu về bản đồ</h2>
                  <p className="text-gray-600">
                    Bản đồ này hiển thị tất cả sự cố đường đã báo cáo, mã màu theo mức độ nghiêm trọng.
                    Nhấp vào bất kỳ điểm đánh dấu nào để xem chi tiết về sự cố và chuyển đến báo cáo đầy đủ.
                  </p>
                  <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800">Chú giải bản đồ</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Các điểm được mã màu theo mức độ: xanh cho thấp, cam cho vừa, cam đậm cho cao, và đỏ cho nghiêm trọng. Các điểm màu xám biểu thị mức độ chưa xác định.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MapView;