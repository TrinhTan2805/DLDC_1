import * as React from 'react';
import { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import imgImageLogo from 'figma:asset/009541fc5d689d29107b655d2b8ecd57f6d4b3ff.png';
import { auth, db } from '@/lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const isLocalhost = window.location.hostname === 'localhost';
  const [username, setUsername] = useState(isLocalhost ? 'admin' : '');
  const [password, setPassword] = useState(isLocalhost ? 'abcd' : '');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra thông tin đăng nhập theo Phương án B
    if (username === 'admin' && password === 'abcd') {
      setIsLoading(true);

      try {
        // Sử dụng đăng nhập ẩn danh của Firebase để có session
        await signInAnonymously(auth);

        // Ghi lại lịch sử truy cập vào Firestore để quản lý
        await addDoc(collection(db, 'access_logs'), {
          username: username,
          timestamp: serverTimestamp(),
          userAgent: navigator.userAgent,
          action: 'login_success'
        });

        toast.success('Đăng nhập thành công');
        onLogin();
      } catch (error) {
        console.error('Logging error:', error);
        // Vẫn cho vào nếu lỗi ghi log (để đảm bảo tính "tiện")
        onLogin();
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Tên đăng nhập hoặc mật khẩu không chính xác');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                <img
                  src={imgImageLogo}
                  alt="Logo Bộ Tư pháp"
                  className="w-16 h-16 object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Kho DLDC
              </h1>
              <p className="text-blue-100 text-sm">Bộ Tư pháp</p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <div className="mb-7 text-center">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Đăng nhập hệ thống
              </h2>
              <p className="text-sm text-slate-600">
                Vui lòng nhập thông tin để tiếp tục
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập"
                    className="block w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm bg-white hover:border-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="block w-full pl-11 pr-11 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm bg-white hover:border-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600">Ghi nhớ đăng nhập</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Đăng nhập bằng SSO</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-8 py-4 text-center border-t border-slate-100">
            <p className="text-xs text-slate-600">
              © 2025 Bộ Tư pháp - Phiên bản 2.1.0
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Cần hỗ trợ? Liên hệ{' '}
            <a
              href="mailto:hotline@moj.gov.vn"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              hotline@moj.gov.vn
            </a>{' '}
            hoặc gọi <span className="font-medium text-slate-700">1900-xxxx</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}