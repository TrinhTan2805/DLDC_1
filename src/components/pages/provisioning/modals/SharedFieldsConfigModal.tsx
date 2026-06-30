import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Eye, EyeOff, ShieldCheck, Database, Check } from 'lucide-react';
import { Portal } from '../../../common/Portal';

interface FieldConfig {
  id: string;
  name: string;
  apiKey: string;
  shared: boolean;
  masking: 'none' | 'mask_first_3' | 'mask_last_4' | 'mask_all';
}

interface SharedFieldsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiName: string;
  apiCode: string;
  consumerUnit: string;
  initialFields: FieldConfig[];
  onSave: (updatedFields: FieldConfig[]) => void;
}

export function SharedFieldsConfigModal({
  isOpen,
  onClose,
  apiName,
  apiCode,
  consumerUnit,
  onSave,
  initialFields
}: SharedFieldsConfigModalProps) {
  const [fields, setFields] = useState<FieldConfig[]>([]);

  const [previewData, setPreviewData] = useState<string>('');

  // Set initial state based on initialFields
  useEffect(() => {
    if (isOpen) {
      setFields(initialFields || []);
    }
  }, [isOpen, initialFields]);

  const handleToggleShared = (id: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, shared: !f.shared } : f));
  };

  const handleApiKeyChange = (id: string, newKey: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, apiKey: newKey } : f));
  };

  const handleMaskingChange = (id: string, value: any) => {
    setFields(fields.map(f => f.id === id ? { ...f, masking: value } : f));
  };

  const applyMask = (value: string, rule: string) => {
    if (rule === 'mask_all') return '•'.repeat(value.length || 8);
    if (rule === 'mask_first_3') {
      if (value.length <= 3) return '•'.repeat(value.length);
      return '•••' + value.slice(3);
    }
    if (rule === 'mask_last_4') {
      if (value.length <= 4) return '•'.repeat(value.length);
      return value.slice(0, -4) + '••••';
    }
    return value;
  };

  // Generate JSON Preview
  useEffect(() => {
    const rawValues: Record<string, string> = {
      maDinhDanh: '001223456789',
      hoTenTre: 'Nguyễn Văn Bé',
      ngaySinh: '01/01/2023',
      gioiTinh: 'Nam',
      hoTenMe: 'Trần Thị Mẹ',
      hoTenCha: 'Nguyễn Văn Cha',
      trangThai: 'Đã phê duyệt'
    };

    const jsonObj: Record<string, string> = {};

    fields.forEach(f => {
      if (f.shared) {
        const originalVal = rawValues[f.id === '1' ? 'maDinhDanh' : 
                                    f.id === '2' ? 'hoTenTre' : 
                                    f.id === '3' ? 'ngaySinh' :
                                    f.id === '4' ? 'gioiTinh' :
                                    f.id === '5' ? 'hoTenMe' :
                                    f.id === '6' ? 'hoTenCha' : 'trangThai'] || 'N/A';
        jsonObj[f.apiKey || 'key'] = applyMask(originalVal, f.masking);
      }
    });

    setPreviewData(JSON.stringify({
      status: 'success',
      data: jsonObj
    }, null, 2));
  }, [fields]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(fields);
    onClose();
  };

  return (
    <Portal>
      <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200" style={{ fontSize: '13px', maxHeight: '90vh' }}>
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div>
              <h3 className="text-[18px] font-bold text-slate-800 flex items-center gap-2" style={{ fontSize: '18px' }}>
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Điều chỉnh các trường dữ liệu chia sẻ
              </h3>
              <p className="text-[13px] text-slate-500 mt-1" style={{ fontSize: '13px' }}>
                Cấu hình gói tin cho API: <strong className="text-slate-700 font-semibold">{apiName} ({apiCode})</strong> | Đơn vị sử dụng: <strong className="text-slate-700 font-semibold">{consumerUnit}</strong>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/30">
            
            {/* Table side (8 cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">
              <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider" style={{ fontSize: '13px' }}>Cấu trúc các trường</span>
                <span className="text-[13px] font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100" style={{ fontSize: '13px' }}>
                  Đang chia sẻ: {fields.filter(f => f.shared).length} / {fields.length} trường
                </span>
              </div>
              
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-[13px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[13px] font-semibold text-slate-500 border-b border-slate-200 uppercase tracking-tight">
                      <th className="px-4 py-3 text-center w-12">Chia sẻ</th>
                      <th className="px-4 py-3">Tên trường (Hệ thống)</th>
                      <th className="px-4 py-3">Tên trường (API JSON)</th>
                      <th className="px-4 py-3 w-40">Che dấu dữ liệu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {fields.map(field => (
                      <tr key={field.id} className={`hover:bg-slate-50/50 transition-colors ${field.shared ? '' : 'bg-slate-50/30 opacity-75'}`}>
                        <td className="px-4 py-3.5 text-center">
                          <input
                            type="checkbox"
                            title="Chọn chia sẻ"
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                            checked={field.shared}
                            onChange={() => handleToggleShared(field.id)}
                          />
                        </td>
                        <td className="px-4 py-3.5 font-medium text-slate-800">
                          {field.name}
                        </td>
                        <td className="px-4 py-3.5">
                          <input
                            type="text"
                            readOnly
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50/80 text-slate-600 font-mono text-[13px] cursor-default outline-none"
                            value={field.apiKey}
                          />
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            disabled
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-[13px] bg-slate-50/80 text-slate-600 cursor-default outline-none disabled:opacity-100"
                            value={field.masking}
                          >
                            <option value="none">Không che dấu</option>
                            <option value="mask_first_3">Che dấu 3 ký tự đầu</option>
                            <option value="mask_last_4">Che dấu 4 ký tự cuối</option>
                            <option value="mask_all">Che dấu toàn bộ</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* JSON Preview side (5 cols) */}
            <div className="lg:col-span-5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col shadow-xl overflow-hidden min-h-[300px]" style={{ fontSize: '13px' }}>
              <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[13px] font-bold text-slate-400 font-mono flex items-center gap-1.5" style={{ fontSize: '13px' }}>
                  <Database className="w-3.5 h-3.5 text-blue-500" />
                  API Response Payload (Preview)
                </span>
                <span className="text-[13px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase" style={{ fontSize: '13px' }}>
                  JSON format
                </span>
              </div>
              
              <pre className="p-4 flex-1 text-[13px] text-blue-300 font-mono overflow-auto leading-relaxed max-h-[450px]">
                <code>{previewData}</code>
              </pre>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50/50">
            <button
              onClick={onClose}
              className="bg-white text-[#020817] border border-[#e2e8f0] hover:bg-slate-50 rounded-lg px-4 py-2 font-medium text-[13px] transition-colors shadow-sm cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-[13px] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Lưu cấu hình
            </button>
          </div>

        </div>
      </div>
    </Portal>
  );
}
