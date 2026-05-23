import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const desktopNavClassName =
  "text-green-800 text-lg hover:text-gray-600 hover:underline transition-colors duration-200";
const mobileNavClassName =
  "text-green-800 hover:bg-green-50 px-6 py-3 flex items-center transition-colors duration-200";

const navItems = [
  { to: "/", label: "Trang chủ" },
  { to: "/about", label: "Về chúng tôi" },
  { to: "/contact", label: "Liên hệ" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";

      const handleEscKey = (event) => {
        if (event.key === "Escape") {
          setMobileMenuOpen(false);
        }
      };

      document.addEventListener("keydown", handleEscKey);

      return () => {
        document.removeEventListener("keydown", handleEscKey);
      };
    }

    document.body.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`w-full px-6 md:px-12 py-4 flex flex-col bg-gray-100 text-black shadow-md fixed top-0 z-50 transition-all duration-300 ${
        mobileMenuOpen ? "pb-2" : ""
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 overflow-hidden flex items-center justify-center">
            <img src="/lago.png" alt="Logo Inspectify" className="w-full h-full object-contain" />
          </div>
          <div className="text-green-800 text-2xl font-bold tracking-wide">
            Giao thông thông minh
          </div>
        </div>

        {!isAuthPage && (
          <>
            <nav className="hidden md:flex space-x-8 text-sm font-medium">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to} className={desktopNavClassName}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center">
              <Link
                to="/login"
                className="border border-blue-800 text-blue-800 hover:bg-blue-50 rounded-full px-5 py-2 text-sm font-medium transition duration-300 mr-3"
              >
                Đăng nhập
              </Link>
              <Link
                to="/signup"
                className="bg-blue-800 text-white hover:bg-green-800 rounded-full px-5 py-2 text-sm font-medium transition duration-300"
              >
                Đăng ký
              </Link>
            </div>

            <div className="md:hidden">
              <button
                ref={buttonRef}
                className="text-black focus:outline-none p-2 rounded-md hover:bg-gray-200 transition-colors"
                onClick={toggleMobileMenu}
                aria-label="Mở menu điều hướng"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {!isAuthPage && mobileMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden mt-4 pb-2 animate-fade-in-down mobile-menu-container bg-white border-gray-200 rounded-lg shadow-lg border"
        >
          <nav className="flex flex-col divide-y divide-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={mobileNavClassName}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="px-6 py-4">
              <Link
                to="/login"
                className="border border-blue-800 text-blue-800 hover:bg-blue-50 px-4 py-3 rounded-md transition-colors duration-200 text-center block font-medium mb-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                to="/signup"
                className="bg-blue-800 text-white hover:bg-blue-900 px-4 py-3 rounded-md transition-colors duration-200 text-center block font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Đăng ký
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
