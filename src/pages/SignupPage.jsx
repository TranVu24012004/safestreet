import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  UserPlus,
  CheckCircle,
  KeyRound,
} from "lucide-react";
import { storeOTP, verifyOTP, removeOTP } from "../utils/otpUtils";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!name || !email || !password) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin.");
      setLoading(false);
      return;
    }

    try {
      console.log("Requesting OTP from server for:", { name, email });
      const response = await fetch("http://localhost:5000/api/generate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (response.ok) {
        if (data.emailSent) {
          setSuccessMessage(
            `Mã xác thực đã được gửi tới ${email}. Vui lòng kiểm tra hộp thư đến và thư rác.`
          );
        } else if (data.otp) {
          setSuccessMessage(`Không thể gửi email. Mã xác thực của bạn là: ${data.otp}`);
        } else {
          setSuccessMessage("Mã xác thực đã được tạo nhưng chưa thể gửi email. Vui lòng thử lại.");
        }

        if (data.otp) {
          storeOTP(email, name, password, data.otp);
        }

        setShowOtpForm(true);
        setCountdown(60);
      } else {
        setErrorMessage(data.error || "Không thể tạo mã xác thực. Vui lòng thử lại.");
      }

      setLoading(false);
    } catch (error) {
      console.error("OTP Request Error:", error);
      setLoading(false);
      setErrorMessage("Không thể kết nối tới máy chủ. Vui lòng thử lại.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      console.log("Verifying OTP locally first:", { email, otp });
      const localResult = verifyOTP(email, otp);
      console.log("Local OTP verification result:", localResult);

      if (localResult.valid) {
        try {
          const { name: verifiedName, email: verifiedEmail, password: verifiedPassword } = localResult.userData;

          const response = await fetch("http://localhost:5000/api/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              name: verifiedName,
              email: verifiedEmail,
              password: verifiedPassword,
            }),
          });

          console.log("Signup response status:", response.status);
          const data = await response.json();
          console.log("Signup response data:", data);

          if (response.ok) {
            removeOTP(email);
            setSuccessMessage("Đăng ký thành công! Đang chuyển tới trang đăng nhập...");
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } else {
            setErrorMessage(data.error || "Đăng ký thất bại. Vui lòng thử lại.");
          }
        } catch (error) {
          console.error("Signup Error:", error);
          setErrorMessage("Không thể tạo tài khoản. Vui lòng thử lại.");
        }
      } else {
        try {
          console.log("Trying server OTP verification:", { email, otp });
          const verifyResponse = await fetch("http://localhost:5000/api/verify-otp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ email, otp }),
          });

          const verifyData = await verifyResponse.json();
          console.log("Server OTP verification response:", verifyData);

          if (verifyResponse.ok) {
            setSuccessMessage("Đăng ký thành công! Đang chuyển tới trang đăng nhập...");
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } else {
            setErrorMessage(verifyData.error || "Mã xác thực không hợp lệ. Vui lòng thử lại.");
          }
        } catch (serverError) {
          console.error("Server OTP Verification Error:", serverError);
          setErrorMessage("Không thể kết nối tới máy chủ. Vui lòng thử lại.");
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setLoading(false);
      setErrorMessage("Đã xảy ra lỗi khi xác thực mã.");
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      console.log("Resending OTP via backend for:", { email, name });

      const response = await fetch("http://localhost:5000/api/generate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log("Resend OTP server response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Không thể gửi lại mã xác thực.");
      }

      if (data.otp) {
        storeOTP(email, name, password, data.otp);
      }

      setSuccessMessage(
        data.emailSent
          ? `Mã xác thực đã được gửi tới ${email}. Vui lòng kiểm tra hộp thư đến và thư rác.`
          : data.otp
            ? `Không thể gửi email. Mã xác thực của bạn là: ${data.otp}`
            : "Mã xác thực đã được tạo nhưng chưa thể gửi email. Vui lòng thử lại."
      );

      setCountdown(60);
      setLoading(false);
    } catch (error) {
      console.error("Resend OTP Error:", error);
      setLoading(false);
      setErrorMessage("Không thể gửi lại mã xác thực. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="min-h-screen flex items-center justify-center p-6 pt-20">
        <div className="bg-white shadow-2xl rounded-3xl flex w-full max-w-5xl overflow-hidden">
          <div className="w-full md:w-1/2 p-10 md:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Tạo tài khoản</h2>
              <p className="text-gray-600">
                Tham gia cùng chúng tôi để bắt đầu báo cáo và theo dõi sự cố mặt đường.
              </p>
            </div>

            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-start mb-6">
                <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start mb-6">
                <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            {showOtpForm ? (
              <form className="space-y-6" onSubmit={handleVerifyOtp}>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-700">
                    Chúng tôi đã gửi mã xác thực tới <strong>{email}</strong>. Vui lòng kiểm tra hộp
                    thư đến, thư rác và nhập mã bên dưới để hoàn tất đăng ký.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã xác thực</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyRound size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Nhập mã gồm 6 chữ số"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xác thực...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} className="mr-2" />
                        Xác thực và hoàn tất đăng ký
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading || countdown > 0}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {countdown > 0 ? `Gửi lại mã sau ${countdown}s` : "Chưa nhận được mã? Gửi lại"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowOtpForm(false);
                      setOtp("");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Quay lại biểu mẫu đăng ký
                  </button>
                </div>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={handleRequestOtp}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="ban@vi.du"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Tạo mật khẩu mạnh"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Mật khẩu cần có ít nhất 8 ký tự.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang gửi mã xác thực...
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} className="mr-2" />
                      Tiếp tục với xác thực email
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-8 text-center">
              Đã có tài khoản?{" "}
              <button
                type="button"
                className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </button>
            </p>
          </div>

          <div className="hidden md:block w-1/2 bg-gradient-to-br from-green-500 to-teal-600 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <svg width="100%" height="100%" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                  <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <rect width="100" height="100" fill="url(#smallGrid)" />
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10 h-full flex flex-col justify-between p-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Tham gia cộng đồng giám sát giao thông</h2>
                <p className="text-white mb-8 leading-relaxed">
                  Tạo tài khoản để gửi báo cáo hư hỏng, theo dõi tiến độ xử lý và góp phần cải thiện
                  an toàn hạ tầng cho cộng đồng.
                </p>

                <div className="space-y-4">
                  {[
                    "Gửi ảnh hư hỏng kèm vị trí",
                    "Theo dõi tiến độ xử lý báo cáo",
                    "Nhận cập nhật từ cơ quan chức năng",
                    "Đóng góp cho hệ thống giao thông an toàn hơn",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="h-5 w-5 text-white/70 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-white">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      "Từ khi tham gia, tôi có thể báo cáo sự cố nhanh hơn và theo dõi trạng thái xử
                      lý rất rõ ràng."
                    </p>
                    <p className="text-white text-sm mt-1">- Thành viên cộng đồng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;
