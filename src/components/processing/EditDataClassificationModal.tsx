import React, { useState, ChangeEvent } from 'react';
import { Shield, Eye, Lock, Globe, AlertTriangle } from 'lucide-react';
import { BaseModal } from '../common/BaseModal';

interface FieldClassification {
  name: string;
  publicLevel: string;
  sensitivityLevel: string;
}

interface EditDataClassificationModalProps {
  dataName: string;
  onClose: () => void;
  onSave: (fields: FieldClassification[]) => void;
}

const publicLevels = [
  { value: 'Công khai', label: 'Công khai', color: 'text-green-700', bg: 'bg-green-100', icon: Globe },
  { value: 'Công khai hạn chế', label: 'Công khai hạn chế', color: 'text-blue-700', bg: 'bg-blue-100', icon: Eye },
  { value: 'Nội bộ', label: 'Nội bộ', color: 'text-orange-700', bg: 'bg-orange-100', icon: Shield },
  { value: 'Mật', label: 'Mật', color: 'text-red-700', bg: 'bg-red-100', icon: Lock },
];

const sensitivityLevels = [
  { value: 'Thấp', label: 'Thấp', color: 'text-green-700', bg: 'bg-green-100', dotColor: 'bg-green-500' },
  { value: 'Trung bình', label: 'Trung bình', color: 'text-yellow-700', bg: 'bg-yellow-100', dotColor: 'bg-yellow-500' },
  { value: 'Cao', label: 'Cao', color: 'text-orange-700', bg: 'bg-orange-100', dotColor: 'bg-orange-500' },
  { value: 'Rất cao', label: 'Rất cao', color: 'text-red-700', bg: 'bg-red-100', dotColor: 'bg-red-500' },
];

const initialFields: FieldClassification[] = [
  { name: 'Mã bản ghi', publicLevel: 'Công khai hạn chế', sensitivityLevel: 'Thấp' },
  { name: 'Họ và tên', publicLevel: 'Nội bộ', sensitivityLevel: 'Cao' },
  { name: 'Ngày sinh', publicLevel: 'Nội bộ', sensitivityLevel: 'Cao' },
  { name: 'Số CCCD', publicLevel: 'Mật', sensitivityLevel: 'Rất cao' },
  { name: 'Địa chỉ', publicLevel: 'Nội bộ', sensitivityLevel: 'Trung bình' },
  { name: 'Giới tính', publicLevel: 'Nội bộ', sensitivityLevel: 'Thấp' },
  { name: 'Quốc tịch', publicLevel: 'Công khai hạn chế', sensitivityLevel: 'Thấp' },
  { name: 'Ngày đăng ký', publicLevel: 'Công khai hạn chế', sensitivityLevel: 'Thấp' },
  { name: 'Trạng thái', publicLevel: 'Công khai', sensitivityLevel: 'Thấp' },
];

/**
 * Standardized Data Classification Modal using BaseModal.
 * Provides a high-quality interface for managing sensitivity and public levels of fields.
 */
export function EditDataClassificationModal({ dataName, onClose, onSave }: EditDataClassificationModalProps) {
  const [fields, setFields] = useState<FieldClassification[]>(initialFields);

  const handlePublicLevelChange = (index: number, value: string) => {
    const newFields = [...fields];
    newFields[index].publicLevel = value;
    setFields(newFields);
  };

  const handleSensitivityLevelChange = (index: number, value: string) => {
    const newFields = [...fields];
    newFields[index].sensitivityLevel = value;
    setFields(newFields);
  };

  const getSensitivityLevelStyle = (level: string) => {
    const found = sensitivityLevels.find(l => l.value === level);
    return found || sensitivityLevels[0];
  };

  const handleSave = () => {
    onSave(fields);
    onClose();
  };

  const footer = (
    <>
      <button 
 type="button"
 onClick={onClose}
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
      isOpen={true}
      onClose={onClose}
      title="Phân loại Dữ liệu"
      subtitle={dataName}
      footer={footer}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-3">
          {fields.map((field, index) => {
            const sensitivityStyle = getSensitivityLevelStyle(field.sensitivityLevel);

            return (
              <div 
                key={index} 
                className="bg-white border border-slate-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-md hover:shadow-blue-900/5 transition-all group"
              >
                <div className="flex items-center gap-5">
                  {/* Status Indicator */}
                  <div className={`w-3 h-3 rounded-full ${sensitivityStyle.dotColor} shadow-inner animate-pulse duration-[2000ms] flex-shrink-0 group-hover:scale-125 transition-transform`} />

                  {/* Field Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-800 font-bold group-hover:text-blue-700 transition-colors">{field.name}</div>
                  </div>

                  {/* Configuration Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Mức công khai</label>
                      <select
                        title="Mức độ công khai"
                        value={field.publicLevel}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => handlePublicLevelChange(index, e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white cursor-pointer hover:border-blue-300 transition-all focus:outline-none focus:ring-4 focus:ring-blue-100/50 min-w-[150px] shadow-sm"
                      >
                        {publicLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Độ nhạy cảm</label>
                      <select
                        title="Mức độ nhạy cảm"
                        value={field.sensitivityLevel}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => handleSensitivityLevelChange(index, e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white cursor-pointer hover:border-blue-300 transition-all focus:outline-none focus:ring-4 focus:ring-blue-100/50 min-w-[130px] shadow-sm"
                      >
                        {sensitivityLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Regulatory Notice */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6 flex gap-5">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <div className="space-y-1">
            <h5 className="text-amber-900 font-bold text-lg">Lưu ý tuân thủ</h5>
            <p className="text-sm text-amber-800/80 leading-relaxed max-w-lg">
              Việc phân loại dữ liệu phải tuân thủ nghiêm ngặt **Nghị định 13/2023/NĐ-CP** về Bảo vệ dữ liệu cá nhân 
              và các quy định hiện hành của Chính phủ về quản lý, khai thác dữ liệu số.
            </p>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}