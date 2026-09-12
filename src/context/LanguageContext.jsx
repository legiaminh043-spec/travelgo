import { createContext, useContext, useState } from "react";

const LanguageContext = createContext(null);

const translations = {
  vi: {
    home: "Trang chủ",
    search: "Tìm kiếm",
    myBookings: "Vé của tôi",
    login: "Đăng nhập",
    register: "Đăng ký",
    logout: "Đăng xuất",
    language: "Ngôn ngữ",
    vietnamese: "Tiếng Việt",
    english: "English",
    flights: "Chuyến bay",
    services: "Dịch vụ",
    destinations: "Điểm đến",
    admin: "Quản trị",
  },

  en: {
    home: "Home",
    search: "Search",
    myBookings: "My bookings",
    login: "Login",
    register: "Register",
    logout: "Logout",
    language: "Language",
    vietnamese: "Vietnamese",
    english: "English",
    flights: "Flights",
    services: "Services",
    destinations: "Destinations",
    admin: "Admin",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("travelgoLanguage") || "vi";
  });

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("travelgoLanguage", newLanguage);
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}