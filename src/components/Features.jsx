import React from "react";
import { motion } from "framer-motion";
import { Camera, BarChart2, FileText, Activity } from "lucide-react";

const featuresData = [
  {
    title: "Phát hiện hư hỏng",
    description:
      "Tự động phát hiện nứt, ổ gà, và suy thoái bề mặt bằng Vision Transformer tiên tiến.",
    icon: Camera,
    color: "from-green-400 to-emerald-500",
    delay: 0.1
  },
  {
    title: "Phân loại mức độ",
    description:
      "Phân loại chính xác mức độ hư hỏng đường để ưu tiên lịch bảo trì và sửa chữa hiệu quả.",
    icon: BarChart2,
    color: "from-blue-400 to-indigo-500",
    delay: 0.3
  },
  {
    title: "Báo cáo thông minh",
    description:
      "Nhận báo cáo hình ảnh theo thời gian thực cùng thông tin hành động và đề xuất sửa chữa.",
    icon: FileText,
    color: "from-purple-400 to-indigo-500",
    delay: 0.5
  },
  {
    title: "Phân tích hiệu suất",
    description:
      "Theo dõi hiệu quả sửa chữa, giám sát sức khỏe cơ sở hạ tầng và tối ưu tài nguyên bảo trì bằng dữ liệu.",
    icon: Activity,
    color: "from-orange-400 to-pink-500",
    delay: 0.7
  }
];

const Features = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-green-50 to-transparent opacity-70"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-t from-green-50 to-transparent rounded-full -mr-48 -mb-48 opacity-70"></div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-block mb-3">
          <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent text-sm font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-green-200">
            Powerful Features
          </span>
        </div>
        
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Tại sao chọn nền tảng của chúng tôi?
        </motion.h2>
        
        <motion.p 
          className="text-gray-700 text-lg max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Hệ thống AI của chúng tôi đảm bảo đánh giá đường chính xác và tự động hóa báo cáo, 
          giúp cơ sở hạ tầng thông minh hơn, an toàn hơn và tiết kiệm chi phí.
        </motion.p>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 group"
              whileHover={{ y: -8, scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: feature.delay, duration: 0.5 }}
            >
              <div className={`flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-6 bg-gradient-to-br ${feature.color} transform transition-transform group-hover:rotate-6 group-hover:scale-110`}>
                <feature.icon className="text-white w-8 h-8" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 text-base leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-20 bg-gradient-to-r from-green-50 to-teal-50 rounded-3xl p-10 shadow-lg border border-green-100"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-left mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Sẵn sàng bắt đầu?</h3>
              <p className="text-gray-600 max-w-xl">
                Tham gia cùng hàng nghìn thành phố và đội bảo trì đường bộ đang sử dụng nền tảng của chúng tôi.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="/signup" className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                Đăng ký ngay !
              </a>
              <a href="/contact" className="px-6 py-3 bg-white text-green-600 font-medium rounded-xl shadow-md border border-green-200 hover:shadow-lg transition-all hover:-translate-y-1">
                Liên hệ
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
