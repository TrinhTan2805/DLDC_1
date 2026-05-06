import React, { useState } from 'react';
import { Database, Layers } from 'lucide-react';
import { BaseModal } from './BaseModal';

interface EditDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  fields: { label: string; key: string }[];
  title: string;
  onSave: (updatedData: any) => void;
  fieldStatus?: Record<string, 'valid' | 'warning'>;
}

/**
 * Standardized Edit Modal for data records.
 * Provides a modern, tabbed interface for editing merged data and viewing sources.
 * Refactored to use BaseModal for consistency.
 */
export function EditDataModal({ 
  isOpen, 
  onClose, 
  data, 
  fields, 
  title, 
  onSave,
  fieldStatus = {} 
}: EditDataModalProps) {
  const [activeTab, setActiveTab] = useState<'sources' | 'merged'>('merged');
  const [formData, setFormData] = useState(data);

  if (!isOpen || !data) return null;

  const handleInputChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData(data); // Reset to original data
    onClose();
  };

  const footer = (
    <>
      <button
 type="button"
 onClick={handleCancel}
 className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all active:scale-95 text-sm"
 >
        Hủy
      </button>
      <button
 type="button"
 onClick={handleSave}
 className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 text-sm"
 >
        Lưu thay đổi
      </button>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      title={title}
      subtitle="Chỉnh sửa thông tin chi tiết của bản ghi"
      footer={footer}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Modern Tabbed Navigation */}
        <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit mb-8 border border-slate-200/50">
          <button
 type="button"
 onClick={() => setActiveTab('sources')}
 className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm transition-all duration-300 ${
 activeTab === 'sources'
 ? 'bg-white text-blue-600 shadow-lg shadow-slate-200 scale-105'
 : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
 }`}
 >
 <Database className={`w-4 h-4 ${activeTab === 'sources' ? 'animate-pulse' : ''}`} />
 Nguồn dữ liệu
 </button>
          <button
 type="button"
 onClick={() => setActiveTab('merged')}
 className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm transition-all duration-300 ${
 activeTab === 'merged'
 ? 'bg-white text-blue-600 shadow-lg shadow-slate-200 scale-105'
 : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
 }`}
 >
 <Layers className={`w-4 h-4 ${activeTab === 'merged' ? 'animate-pulse' : ''}`} />
 Dữ liệu đã gộp
 </button>
        </div>

        {/* Content Area */}
        {activeTab === 'sources' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-100 rounded-2xl p-6 flex gap-5">
               <div className="w-14 h-14 bg-blue-100/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                 <Database className="w-7 h-7 text-blue-600" />
               </div>
               <div>
                  <h4 className="text-blue-900 font-bold text-lg mb-1">Thông tin đa nguồn</h4>
                  <p className="text-sm text-blue-700/80 leading-relaxed max-w-lg">
                    Hệ thống đã thu thập dữ liệu từ các nguồn khác nhau. Bạn đang xem dữ liệu thô từ các nguồn trước khi gộp.
                  </p>
               </div>
             </div>
             <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-slate-50/20 rounded-3xl border-2 border-dashed border-slate-100">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                 <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
               </div>
               <p className="text-sm font-bold text-slate-500">Đang tải dữ liệu nguồn chi tiết...</p>
             </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
              {fields.map((field) => {
                const value = formData[field.key] || '';
                const status = fieldStatus[field.key];
                const borderColor = status === 'valid' ? 'border-green-200' : status === 'warning' ? 'border-amber-200' : 'border-slate-200';
                const labelColor = status === 'valid' ? 'text-green-700' : status === 'warning' ? 'text-amber-700' : 'text-slate-600';
                const iconColor = status === 'valid' ? 'bg-green-500' : status === 'warning' ? 'bg-amber-500' : 'bg-slate-300';

                return (
                  <div key={field.key} className="group space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-4 rounded-full ${iconColor} transition-all duration-300 group-focus-within:h-6`} />
                      <label className={`block text-xs font-bold uppercase tracking-widest ${labelColor}`}>
                        {field.label}
                      </label>
                    </div>
                    <input
                      type="text"
                      value={value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(field.key, e.target.value)}
                      className={`w-full px-5 py-3.5 bg-white border ${borderColor} rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-blue-500 transition-all text-sm font-semibold text-slate-800 placeholder:text-slate-300`}
                      placeholder={`Nhập ${field.label.toLowerCase()}...`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
