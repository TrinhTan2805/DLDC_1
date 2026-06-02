import React from 'react';
import { X, Check } from 'lucide-react';

export interface CreateDataRequestPayload {
  org: string;
  dataType: string;
  fromDate: string;
  toDate: string;
  format: 'excel' | 'csv' | 'json' | 'xml';
  purpose: string;
  dataOwner: string;
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
  const [dataOwner, setDataOwner] = React.useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!org.trim() || !dataType.trim() || !dataOwner.trim()) return;
    onCreate?.({ org: org.trim(), dataType, fromDate, toDate, format, purpose: purpose.trim(), dataOwner });
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
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nội dung yêu cầu <span className="text-red-500">*</span></label>
            <input value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Cơ quan / Hệ thống yêu cầu" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Phân loại dữ liệu <span className="text-red-500">*</span></label>
            <select value={dataType} onChange={(e) => setDataType(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
              <option value="">Chọn loại dữ liệu</option>
              <option value="Dữ liệu Hộ tịch điện tử">Dữ liệu Hộ tịch điện tử</option>
              <option value="Dữ liệu Thi hành án">Dữ liệu Thi hành án</option>
              <option value="Dữ liệu Lý lịch tư pháp">Dữ liệu Lý lịch tư pháp</option>
              <option value="Dữ liệu Doanh nghiệp">Dữ liệu Doanh nghiệp</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Người chủ quản dữ liệu <span className="text-red-500">*</span></label>
            <select value={dataOwner} onChange={(e) => setDataOwner(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
              <option value="">Chọn người chủ quản dữ liệu</option>
              <option value="Đ/c Trần Văn Lãnh Đạo (Trưởng phòng Dữ liệu)">Đ/c Trần Văn Lãnh Đạo (Trưởng phòng Dữ liệu)</option>
              <option value="Đ/c Nguyễn Thị B (Phó Cục trưởng)">Đ/c Nguyễn Thị B (Phó Cục trưởng)</option>
              <option value="Đ/c Lê Văn C (Chuyên viên chính)">Đ/c Lê Văn C (Chuyên viên chính)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Từ ngày</label>
              <input value={fromDate} onChange={(e) => setFromDate(e.target.value)} type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Đến ngày</label>
              <input value={toDate} onChange={(e) => setToDate(e.target.value)} type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Định dạng file kết xuất</label>
            <div className="flex gap-4 text-sm mt-1">
              <label className="flex items-center gap-2 cursor-pointer"><input type="radio" className="accent-amber-600" checked={format === 'excel'} onChange={() => setFormat('excel')} />Excel</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="radio" className="accent-amber-600" checked={format === 'csv'} onChange={() => setFormat('csv')} />CSV</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="radio" className="accent-amber-600" checked={format === 'json'} onChange={() => setFormat('json')} />JSON</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="radio" className="accent-amber-600" checked={format === 'xml'} onChange={() => setFormat('xml')} />XML</label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Mô tả chi tiết yêu cầu</label>
            <textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} rows={3} placeholder="Mục đích sử dụng dữ liệu" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium">Hủy bỏ</button>
          <button onClick={handleCreate} disabled={!org.trim() || !dataType.trim() || !dataOwner.trim()} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            <Check className="w-5 h-5 mr-2" />Tạo và gửi yêu cầu
          </button>
        </div>
      </div>
    </div>
  );
}
