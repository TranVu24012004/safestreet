import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-green-50 text-gray-700 w-full border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Inspectify</h2>
              <p className="text-green-600 text-sm font-medium">Phát hiện hư hỏng đường bằng AI</p>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Công nghệ kiểm tra đường tự động được hỗ trợ bởi trí tuệ nhân tạo.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">Tính năng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/features" className="text-gray-600 hover:text-green-600 transition-colors">
                  Phát hiện hư hỏng
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-600 hover:text-green-600 transition-colors">
                  Phân tích mức độ
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-600 hover:text-green-600 transition-colors">
                  Lập kế hoạch bảo trì
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">Công ty</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-green-600 transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-green-600 transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-green-600 transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">Kết nối</h3>
            <div className="flex space-x-3 mb-4">
              <a href="#" className="text-gray-500 hover:text-green-600 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-green-600 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-green-600 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-green-600 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
            <p className="text-sm text-gray-500">
              Email: safestreet386@gmail.com<br/>
              Phone: +040 7244 527490<br/>
      
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-50 py-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex justify-center md:justify-between items-center">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Inspectify AI. All rights reserved.
          </div>
          
          <div className="hidden md:block text-xs text-gray-400">
            Được hỗ trợ bởi AI cho bảo trì đường thông minh
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
