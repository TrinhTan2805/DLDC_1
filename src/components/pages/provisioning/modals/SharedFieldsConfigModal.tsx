import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Eye, EyeOff, ShieldCheck, Database, Check } from 'lucide-react';
import { Portal } from '../../../common/Portal';
import { Badge, BTN_GHOST_ICON, BTN_OUTLINE, BTN_PRIMARY, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS } from '../../collection/collectionUi';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;

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
  readOnly?: boolean;
}

export function SharedFieldsConfigModal({
  isOpen,
  onClose,
  apiName,
  apiCode,
  consumerUnit,
  onSave,
  initialFields,
  readOnly = false
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
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

          {/* Header */}
          <div className="flex items-start justify-between px-6 py-4 border-b border-[#E2E8F0] flex-shrink-0">
            <div>
              <h3 className="text-[16px] font-semibold text-[#020817]">
                {readOnly ? 'Xem chi tiết cấu trúc trường dữ liệu chia sẻ' : 'Điều chỉnh các trường dữ liệu chia sẻ'}
              </h3>
              <p className="text-[13px] text-[#64748B] mt-1 leading-5">
                Cấu hình gói tin cho API: <span className="text-[#020817] font-medium">{apiName} ({apiCode})</span> | Đơn vị sử dụng: <span className="text-[#020817] font-medium">{consumerUnit}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={BTN_GHOST_ICON}
              aria-label="Đóng"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4 overflow-y-auto custom-scrollbar flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Table side */}
            <div className="lg:col-span-7 bg-white rounded-lg border border-[#E2E8F0] overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-[#E2E8F0] flex justify-between items-center gap-2">
                <span className="text-[14px] font-medium text-[#020817]">Cấu trúc các trường</span>
                <Badge label={`Đang chia sẻ: ${fields.filter(f => f.shared).length} / ${fields.length} trường`} variant="blue" />
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full border-collapse collection-table text-[13px]">
                  <thead className="bg-[#F8FAFC]">
                    <tr className="h-[42px]">
                      <th className="px-3 py-[13px] leading-4 text-center font-bold text-black whitespace-nowrap text-[13px] w-12">Chia sẻ</th>
                      <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]">Tên trường (Hệ thống)</th>
                      <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]">Tên trường (API JSON)</th>
                      <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px] w-40">Che dấu dữ liệu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map(field => (
                      <tr key={field.id} className={`h-12 border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors ${field.shared ? 'bg-white' : 'bg-[#F8FAFC]'}`}>
                        <td className="px-3 py-1 text-center">
                          <input
                            type="checkbox"
                            title="Chọn chia sẻ"
                            aria-label={`Chia sẻ ${field.name}`}
                            disabled={readOnly}
                            className={`w-4 h-4 rounded border-[#CBD5E1] accent-blue-600 ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                            checked={field.shared}
                            onChange={() => !readOnly && handleToggleShared(field.id)}
                          />
                        </td>
                        <td className={`px-3 py-1 text-[13px] whitespace-nowrap ${field.shared ? 'text-black' : 'text-[#64748B]'}`}>
                          {field.name}
                        </td>
                        <td className="px-3 py-1">
                          <input
                            type="text"
                            readOnly
                            disabled={readOnly}
                            aria-label={`Tên trường API của ${field.name}`}
                            className={`${INPUT_CLS} bg-[#F8FAFC] cursor-default`}
                            value={field.apiKey}
                          />
                        </td>
                        <td className="px-3 py-1">
                          <select
                            disabled
                            aria-label={`Che dấu dữ liệu của ${field.name}`}
                            className={`${INPUT_CLS} disabled:bg-[#F8FAFC] disabled:text-[#020817] disabled:cursor-default`}
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

            {/* JSON Preview side */}
            <div className="lg:col-span-5 bg-white rounded-lg border border-[#E2E8F0] flex flex-col overflow-hidden min-h-[300px]">
              <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between gap-2">
                <span className="text-[14px] font-medium text-[#020817] flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-blue-600" />
                  API Response Payload (Preview)
                </span>
                <Badge label="JSON format" variant="blue" />
              </div>

              <div className="p-4 flex-1 min-h-0">
                <pre className="h-full max-h-[450px] overflow-auto custom-scrollbar p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] leading-relaxed whitespace-pre-wrap break-words font-sans">
                  <code className="font-sans">{previewData}</code>
                </pre>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 flex-shrink-0">
            <button type="button" onClick={onClose} className={BTN_OUTLINE}>
              {readOnly ? 'Đóng' : 'Hủy bỏ'}
            </button>
            {!readOnly && (
              <button type="button" onClick={handleSave} className={BTN_PRIMARY}>
                <Save className="w-4 h-4" />
                Lưu cấu hình
              </button>
            )}
          </div>

        </div>
      </div>
    </Portal>
  );
}
