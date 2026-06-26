import { useState } from 'react';
import { X, Save, AlertTriangle, Loader2, Globe, Users, Building2 } from 'lucide-react';

interface UnpublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, selectedScopes: string[]) => void;
  recordName: string;
  scopes?: string[];
}

export function UnpublishModal({ isOpen, onClose, onConfirm, recordName, scopes = [] }: UnpublishModalProps) {
  const [reason, setReason] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(scopes || []);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do hủy công khai!');
      return;
    }

    setIsScanning(true);
    setScanProgress(0);

    // Mock progress bar scanning for 1.5s
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setIsScanning(false);
      onConfirm(reason, selectedScopes);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-[18px] font-bold text-slate-800">Hủy công khai danh mục</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isScanning}
            title="Đóng" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-slate-600 border-b border-slate-100 pb-4">
            Bạn đang yêu cầu hủy công khai danh mục <span className="font-semibold text-slate-900">{recordName}</span>. Danh mục này sẽ không còn hiển thị trên Cổng dữ liệu mở.
          </p>

          <div>
             <div className="text-[13px] font-medium text-slate-700 mb-2">Chọn phạm vi để hủy công khai:</div>
             <div className="space-y-3">
                {scopes.includes('internal') && (
                  <label 
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedScopes.includes('internal') ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-red-300'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedScopes(prev => prev.includes('internal') ? prev.filter(s => s !== 'internal') : [...prev, 'internal']);
                    }}
                  >
                    <div className="mt-0.5">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedScopes.includes('internal') ? 'bg-red-500 border-red-500' : 'border-slate-300'}`}>
                        {selectedScopes.includes('internal') && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                       <Building2 className={`w-4 h-4 ${selectedScopes.includes('internal') ? 'text-red-500' : 'text-slate-500'}`} />
                       <span className={`font-medium ${selectedScopes.includes('internal') ? 'text-red-900' : 'text-slate-700'}`}>Nội bộ ngành</span>
                    </div>
                  </label>
                )}
                
                {scopes.includes('extended') && (
                  <label 
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedScopes.includes('extended') ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-red-300'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedScopes(prev => prev.includes('extended') ? prev.filter(s => s !== 'extended') : [...prev, 'extended']);
                    }}
                  >
                    <div className="mt-0.5">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedScopes.includes('extended') ? 'bg-red-500 border-red-500' : 'border-slate-300'}`}>
                        {selectedScopes.includes('extended') && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                       <Users className={`w-4 h-4 ${selectedScopes.includes('extended') ? 'text-red-500' : 'text-slate-500'}`} />
                       <span className={`font-medium ${selectedScopes.includes('extended') ? 'text-red-900' : 'text-slate-700'}`}>Mở rộng liên ngành</span>
                    </div>
                  </label>
                )}

                {scopes.includes('public') && (
                  <label 
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedScopes.includes('public') ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-red-300'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedScopes(prev => prev.includes('public') ? prev.filter(s => s !== 'public') : [...prev, 'public']);
                    }}
                  >
                    <div className="mt-0.5">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedScopes.includes('public') ? 'bg-red-500 border-red-500' : 'border-slate-300'}`}>
                        {selectedScopes.includes('public') && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                       <Globe className={`w-4 h-4 ${selectedScopes.includes('public') ? 'text-red-500' : 'text-slate-500'}`} />
                       <span className={`font-medium ${selectedScopes.includes('public') ? 'text-red-900' : 'text-slate-700'}`}>Toàn dân</span>
                    </div>
                  </label>
                )}
             </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1">Lý do hủy công khai *</label>
            <textarea title="Mô tả"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isScanning}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-red-500 resize-none disabled:bg-slate-50"
              placeholder="Nhập lý do chi tiết..."
            />
          </div>

          {isScanning && (
            <div className="space-y-2 mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-700 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  Đang quét hệ thống khai thác...
                </span>
                <span className="font-medium text-blue-600">{Math.min(scanProgress, 100)}%</span>
              </div>
              <progress 
                value={Math.min(scanProgress, 100)} 
                max="100" 
                className="w-full h-1.5 overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-slate-200 [&::-webkit-progress-value]:bg-blue-600 [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-200 [&::-moz-progress-bar]:bg-blue-600 [&::-moz-progress-bar]:transition-all [&::-moz-progress-bar]:duration-200 bg-slate-200 appearance-none"
              />
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isScanning}
            title="Thoát" className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium transition-colors disabled:opacity-50"
          >
            Thoát
          </button>
          <button
            onClick={handleConfirm}
            disabled={isScanning || !reason.trim() || selectedScopes.length === 0}
            title="Hủy công khai" className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px] justify-center"
          >
            Hủy công khai
          </button>
        </div>
      </div>
    </div>
  );
}
