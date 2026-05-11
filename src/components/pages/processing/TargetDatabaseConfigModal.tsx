import React from 'react';
import { X, ArrowLeft, Database, ChevronRight, PlusCircle, Search } from 'lucide-react';

interface TargetDatabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onDownloadTarget: () => void;
  onNext: (data: any) => void;
  initialData?: any;
}

export function TargetDatabaseConfigModal({
  isOpen,
  onClose,
  onBack,
  onDownloadTarget,
  onNext,
  initialData
}: TargetDatabaseConfigModalProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    targetName: '',
    type: 'DBT_POSTGRESQL',
    insertType: 'Không',
    host: '',
    port: '',
    username: '',
    password: '',
    ...initialData
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isNextDisabled = !formData.name;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] font-sans p-4 animate-in fade-in duration-200"
      style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
    >
      <div className="bg-[#1e293b] w-full max-w-3xl rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-700">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800 relative z-20">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Cơ sở dữ liệu đích</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 bg-white overflow-y-auto max-h-[80vh] relative z-10">
          <div className="grid grid-cols-2 gap-x-12 gap-y-8">
            {/* Tên CSDL */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Tên CSDL</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Nhập tên CSDL..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Tên CSDL đích */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Tên CSDL đích</label>
              <input
                type="text"
                value={formData.targetName}
                onChange={(e) => handleChange('targetName', e.target.value)}
                placeholder="Nhập tên CSDL đích..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Kiểu CSDL */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Kiểu CSDL</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                title="Kiểu CSDL"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="DBT_POSTGRESQL">DBT_POSTGRESQL</option>
                <option value="DBT_ORACLE">DBT_ORACLE</option>
                <option value="DBT_SQLSERVER">DBT_SQLSERVER</option>
              </select>
            </div>

            {/* Kiểu chèn */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Kiểu chèn</label>
              <select
                value={formData.insertType}
                onChange={(e) => handleChange('insertType', e.target.value)}
                title="Kiểu chèn"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="Không">Không</option>
                <option value="Cập nhật">Cập nhật</option>
                <option value="Ghi đè">Ghi đè</option>
              </select>
            </div>

            {/* Địa chỉ */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Địa chỉ</label>
              <input
                type="text"
                value={formData.host}
                onChange={(e) => handleChange('host', e.target.value)}
                placeholder="VD: 10.15.20.45"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {/* Port */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Port</label>
              <input
                type="text"
                value={formData.port}
                onChange={(e) => handleChange('port', e.target.value)}
                placeholder="5432"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="postgres"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-white border-t border-slate-100 flex items-center justify-between relative z-20">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Trở về
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onDownloadTarget}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              <Search className="w-4 h-4" />
              Tải CSDL đích
            </button>
            <button
              onClick={() => onNext(formData)}
              disabled={isNextDisabled}
              className={`flex items-center gap-2 px-8 py-2.5 text-sm font-medium text-white rounded-lg transition-all shadow-md ${isNextDisabled
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                }`}
            >
              Tiếp theo
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
