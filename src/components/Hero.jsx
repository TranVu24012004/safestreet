import React from "react";
import { useNavigate } from "react-router-dom";
import StyledButton from "./StyledButton";

const Hero = () => {
  const navigate = useNavigate();

  const handleDemoClick = () => {
    navigate("/demo");
  };

  return (
    <section
      className="py-20 px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-between bg-white"
      style={{ fontFamily: "'Rethink Sans', sans-serif" }}
    >
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-green-900">
          Phát hiện hư hỏng mặt đường nhanh hơn với AI.
        </h1>
        <p className="text-lg text-gray-600">
          Nền tảng của chúng tôi giúp nhận diện sự cố mặt đường, ưu tiên xử lý và hỗ trợ báo cáo
          trực quan để nâng cao an toàn hạ tầng giao thông.
        </p>

        <StyledButton onClick={handleDemoClick}>Xem demo</StyledButton>
      </div>

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
          Trình duyệt của bạn không hỗ trợ phát video.
        </video>
      </div>
    </section>
  );
};

export default Hero;
