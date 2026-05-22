import React from 'react';
import { X, Check } from 'lucide-react';

export interface CreateDataRequestPayload {
  org: string;
  dataType: string;
  fromDate: string;
  toDate: string;
  format: 'excel' | 'csv' | 'json' | 'xml';
  purpose: string;
}

interface ProvisionDataRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (payload: CreateDataRequestPayload) => void;
}

export function ProvisionDataRequestModal({ isOpen, onClose, onCreate }: ProvisionDataRequestModalProps) {
  const [org, setOrg] = React.useState('');
  const [dataType, setDataType] = React.useState('');
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [format, setFormat] = React.useState<'excel' | 'csv' | 'json' | 'xml'>('excel');
  const [purpose, setPurpose] = React.useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!org.trim() || !dataType.trim()) return;
    onCreate?.({ org: org.trim(), dataType, fromDate, toDate, format, purpose: purpose.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Tạo yêu cầu kết xuất dữ liệu</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <input value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Cơ quan / Hệ thống yêu cầu *" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg" />
          <select value={dataType} onChange={(e) => setDataType(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg">
            <option value="">Chọn loại dữ liệu *</option>
            <option value="Dữ liệu Hộ tịch điện tử">Dữ liệu Hộ tịch điện tử</option>
            <option value="Dữ liệu Thi hành án">Dữ liệu Thi hành án</option>
            <option value="Dữ liệu Lý lịch tư pháp">Dữ liệu Lý lịch tư pháp</option>
            <option value="Dữ liệu Doanh nghiệp">Dữ liệu Doanh nghiệp</option>
          </select>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={fromDate} onChange={(e) => setFromDate(e.target.value)} type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg" />
            <input value={toDate} onChange={(e) => setToDate(e.target.value)} type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg" />
          </div>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="radio" checked={format === 'excel'} onChange={() => setFormat('excel')} />Excel</label>
            <label className="flex items-center gap-2"><input type="radio" checked={format === 'csv'} onChange={() => setFormat('csv')} />CSV</label>
            <label className="flex items-center gap-2"><input type="radio" checked={format === 'json'} onChange={() => setFormat('json')} />JSON</label>
            <label className="flex items-center gap-2"><input type="radio" checked={format === 'xml'} onChange={() => setFormat('xml')} />XML</label>
          </div>
          <textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} rows={3} placeholder="Mục đích sử dụng dữ liệu" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg" />
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium">Hủy bỏ</button>
          <button onClick={handleCreate} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center transition-colors font-medium">
            <Check className="w-5 h-5 mr-2" />Tạo yêu cầu
          </button>
        </div>
      </div>
    </div>
  );
}
