import React from 'react';
import { ArrowLeft, Database, ChevronRight, Search } from 'lucide-react';
import { BaseModal } from '../../common/BaseModal';

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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isNextDisabled = !formData.name;

  const footer = (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={onBack}
        style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 500 }}
        className="flex items-center gap-2 text-[13px] text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        Trở về
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={onDownloadTarget}
          style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 500 }}
          className="flex items-center gap-2 text-[13px] text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all active:scale-95"
        >
          <Search className="w-4 h-4" />
          Tải CSDL đích
        </button>
        <button
          onClick={() => onNext(formData)}
          disabled={isNextDisabled}
          style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 500 }}
          className={`flex items-center gap-2 text-[13px] text-white transition-all shadow-md ${isNextDisabled
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
        >
          Tiếp theo
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Cấu hình Cơ sở dữ liệu đích"
        subtitle="Nhập thông tin kết nối chi tiết cho CSDL đích"
        maxWidth="max-w-3xl"
        customHeaderIcon={
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mr-4">
            <Database className="w-6 h-6" />
          </div>
        }
        footer={footer}
      >
        <div className="py-2">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {/* Tên CSDL */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tên CSDL</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Nhập tên CSDL..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
              />
            </div>
  
            {/* Tên CSDL đích */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tên CSDL đích</label>
              <input
                type="text"
                value={formData.targetName}
                onChange={(e) => handleChange('targetName', e.target.value)}
                placeholder="Nhập tên CSDL đích..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
              />
            </div>
  
            {/* Kiểu CSDL */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kiểu CSDL</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                title="Kiểu CSDL"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="DBT_POSTGRESQL">DBT_POSTGRESQL</option>
                <option value="DBT_ORACLE">DBT_ORACLE</option>
                <option value="DBT_SQLSERVER">DBT_SQLSERVER</option>
              </select>
            </div>
  
            {/* Kiểu chèn */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kiểu chèn</label>
              <select
                value={formData.insertType}
                onChange={(e) => handleChange('insertType', e.target.value)}
                title="Kiểu chèn"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="Không">Không</option>
                <option value="Cập nhật">Cập nhật</option>
                <option value="Ghi đè">Ghi đè</option>
              </select>
            </div>
  
            {/* Địa chỉ */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Địa chỉ</label>
              <input
                type="text"
                value={formData.host}
                onChange={(e) => handleChange('host', e.target.value)}
                placeholder="VD: 10.15.20.45"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
  
            {/* Port */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Port</label>
              <input
                type="text"
                value={formData.port}
                onChange={(e) => handleChange('port', e.target.value)}
                placeholder="5432"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
  
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="postgres"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
  
            {/* Password */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
