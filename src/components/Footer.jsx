import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-green-50 text-gray-700 w-full border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Inspectify</h2>
              <p className="text-green-600 text-sm font-medium">Nền tảng AI hỗ trợ giám sát mặt đường</p>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Giải pháp giúp phát hiện hư hỏng, theo dõi báo cáo và hỗ trợ bảo trì hạ tầng giao
              thông hiệu quả hơn.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">Khám phá</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-gray-600 hover:text-green-600 transition-colors">
                  Demo hướng dẫn
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-600 hover:text-green-600 transition-colors">
                  Đăng ký tài khoản
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">Thông tin</h3>
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
                <Link to="/login" className="text-gray-600 hover:text-green-600 transition-colors">
                  Đăng nhập
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">Kết nối</h3>
            <div className="flex space-x-3 mb-4">
              <a href="#" className="text-gray-500 hover:text-green-600 transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-green-600 transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-green-600 transition-colors" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-green-600 transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            </div>
            <p className="text-sm text-gray-500">
              Email: safestreet386@gmail.com
              <br />
              Điện thoại: +040 7244 527490
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex justify-center md:justify-between items-center">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Inspectify AI. Bảo lưu mọi quyền.
          </div>

          <div className="hidden md:block text-xs text-gray-400">
            AI đồng hành cùng quản lý và bảo trì giao thông thông minh
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
