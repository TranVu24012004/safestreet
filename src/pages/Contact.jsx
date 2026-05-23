import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { Mail, Phone, MapPin, Send, User, MessageSquare, AlertCircle, CheckCircle } from "lucide-react";

const Contact = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("roadVisionUserId");
    const storedUserName = localStorage.getItem("roadVisionUserName");

    if (storedUserId) {
      setUserId(storedUserId);
    }

    if (storedUserName) {
      setUserName(storedUserName);
      setFormData((prev) => ({
        ...prev,
        name: storedUserName,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const feedbackData = {
        ...formData,
        userId,
      };

      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        if (userId) {
          setFormData({ name: userName, email: "", subject: "", message: "" });
        } else {
          setFormData({ name: "", email: "", subject: "", message: "" });
        }
      } else {
        setError(data.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } catch (submitError) {
      console.error("Error submitting feedback:", submitError);
      setError("Không thể kết nối mạng. Vui lòng kiểm tra lại và thử tiếp.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-3">
            <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent text-sm font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-green-200">
              Liên hệ
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Liên hệ với chúng tôi</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng tiếp nhận câu hỏi, góp ý và phản hồi để hoàn thiện nền tảng tốt
            hơn.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-1 space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
              variants={itemVariants}
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-xl mr-4">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">Chúng tôi phản hồi trong vòng 24 giờ làm việc</p>
                </div>
              </div>
              <a href="mailto:safestreet386@gmail.com" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                safestreet386@gmail.com
              </a>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
              variants={itemVariants}
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-xl mr-4">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Điện thoại</h3>
                  <p className="text-gray-600">Thứ Hai đến Thứ Sáu, từ 8h đến 17h</p>
                </div>
              </div>
              <a href="tel:+917989841976" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                +91 7989841976
              </a>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
              variants={itemVariants}
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-xl mr-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Địa chỉ</h3>
                  <p className="text-gray-600">Văn phòng vận hành</p>
                </div>
              </div>
              <p className="text-gray-700">
                Koheda Road
                <br />
                Ibrahimpatnam
                <br />
                Rangareddy, Telangana 501510
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gửi tin nhắn cho chúng tôi</h2>

            {success && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-start">
                <CheckCircle className="text-green-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-green-800 font-medium">Đã gửi tin nhắn thành công</p>
                  <p className="text-green-700 mt-1">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
                <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-red-800 font-medium">Không thể gửi tin nhắn</p>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="ban@vi.du"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Chủ đề
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Bạn đang cần hỗ trợ nội dung gì?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <MessageSquare size={18} className="text-gray-400" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Hãy cho chúng tôi biết vấn đề hoặc góp ý của bạn..."
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Gửi tin nhắn
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Câu hỏi thường gặp</h2>
          <p className="text-lg text-gray-600">Một số thắc mắc phổ biến khi sử dụng nền tảng.</p>
        </div>

        <div className="space-y-6">
          {[
            {
              question: "Làm sao để tải lên hoặc chụp ảnh phục vụ phát hiện hư hỏng?",
              answer: "Bạn có thể tải ảnh từ thiết bị hoặc chụp trực tiếp trong mục \"Máy ảnh\". Hãy đảm bảo bề mặt đường hiển thị rõ để hệ thống phân tích chính xác hơn.",
            },
            {
              question: "Hệ thống có thể phát hiện những loại hư hỏng nào?",
              answer: "Mô hình AI hiện hỗ trợ nhận diện nhiều dạng hư hỏng mặt đường như nứt dọc, nứt ngang, nứt dạng mạng và ổ gà.",
            },
            {
              question: "Ứng dụng lấy vị trí của tôi như thế nào? Có an toàn không?",
              answer: "Khi bạn tải ảnh hoặc chụp ảnh, trình duyệt sẽ xin quyền truy cập vị trí hiện tại. Dữ liệu này được dùng để gắn vị trí cho báo cáo và hỗ trợ cơ quan chức năng xác định khu vực xử lý.",
            },
            {
              question: "Tôi có thể xem lại các ảnh và báo cáo trước đó ở đâu?",
              answer: "Bạn có thể xem lại dữ liệu đã gửi trong mục \"Lịch sử\" trên bảng điều khiển người dùng.",
            },
            {
              question: "Dữ liệu của tôi có được bảo mật không?",
              answer: "Có. Ảnh, vị trí và thông tin liên quan được lưu trữ để phục vụ báo cáo và theo dõi xử lý. Chúng tôi không chia sẻ dữ liệu cho bên thứ ba ngoài phạm vi vận hành cần thiết.",
            },
          ].map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
