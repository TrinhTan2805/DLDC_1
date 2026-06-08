import { useState, useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './components/pages/LoginPage';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { PreviewApiDocsPage } from './components/pages/provisioning/PreviewApiDocsPage';

// Main App Component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Lắng nghe trạng thái đăng nhập từ Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Nếu truy cập trang xem tài liệu đặc tả, hiển thị luôn không cần layout/auth
  if (window.location.pathname === '/preview-api-docs') {
    return <PreviewApiDocsPage />;
  }

  // Hiển thị loading trong khi kiểm tra auth
  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Nếu chưa đăng nhập, hiển thị màn login
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  // Đã đăng nhập, hiển thị hệ thống chính với khả năng logout
  return <MainLayout onLogout={handleLogout} />;
}