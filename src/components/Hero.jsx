import React from 'react';
import { useNavigate } from 'react-router-dom';
import StyledButton from "./StyledButton"; 

const Hero = () => {
  const navigate = useNavigate();

  const handleDemoClick = () => {
    navigate('/demo');
  };

  return (
    <section
      className="py-20 px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-between bg-white"
      style={{ fontFamily: "'Rethink Sans', sans-serif" }}
    >
      {/* Left Side - Text */}
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-green-900">
          <br />
        
          Đường phố thông minh bắt đầu từ kiểm tra thông minh.
        </h1>
        <p className="text-lg text-gray-600">
          Hệ thống phát hiện hư hỏng và ưu tiên sửa chữa bằng AI giúp đơn giản hóa kiểm tra đường và nâng cao an toàn cơ sở hạ tầng.
        </p>
       
      <StyledButton onClick={handleDemoClick}>
        Bắt đầu demo
      </StyledButton>
      </div>

      {/* Right Side - Video */}
      <div className="pt-5 pl-45 md:w-1/2 mt-10 md:mt-0 flex justify-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full max-w-[400px] max-h-[580px] rounded-lg shadow-xl object-cover"
        >
          <source src="/heroo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};



export default Hero;
