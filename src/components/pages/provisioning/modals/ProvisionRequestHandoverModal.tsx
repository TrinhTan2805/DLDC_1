import React, { useState, useEffect } from 'react';
import { X, Upload, FileText } from 'lucide-react';

interface ProvisionRequestHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData?: any;
  onConfirmHandover: (id: string, receivingUnit: string, file: File | null) => void;
}

export function ProvisionRequestHandoverModal({ isOpen, onClose, requestData, onConfirmHandover }: ProvisionRequestHandoverModalProps) {
  const [receivingUnit, setReceivingUnit] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen && requestData) {
      setReceivingUnit(requestData.org || '');
      setSelectedFile(null);
    }
  }, [isOpen, requestData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Bàn giao dữ liệu</h2>
          <button aria-label="Đóng" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2">Mã YC: {requestData?.id}</h3>
            <p className="text-sm text-slate-600 mb-1"><span className="font-semibold text-slate-700">Cơ quan yêu cầu:</span> {requestData?.org}</p>
            <p className="text-sm text-slate-600 mb-1"><span className="font-semibold text-slate-700">Loại dữ liệu:</span> {requestData?.dataType}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Đơn vị nhận bàn giao <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={receivingUnit}
              onChange={(e) => setReceivingUnit(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" 
              placeholder="Nhập tên đơn vị nhận bàn giao" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Biên bản bàn giao <span className="text-red-500">*</span></label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors">
              <input 
                type="file" 
                id="handover-file"
                className="hidden" 
                onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
              />
              <label htmlFor="handover-file" className="cursor-pointer flex flex-col items-center w-full">
                {selectedFile ? (
                  <>
                    <FileText className="w-10 h-10 text-emerald-500 mb-2" />
                    <span className="text-sm font-medium text-slate-800 text-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap px-4">{selectedFile.name}</span>
                    <span className="text-xs text-slate-500 mt-1">Nhấn để thay đổi file</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-slate-400 mb-2" />
                    <span className="text-sm font-medium text-amber-600">Tải lên tệp biên bản</span>
                    <span className="text-xs text-slate-500 mt-1">Hỗ trợ PDF, DOCX, JPG (Tối đa 10MB)</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-xl">
          <button aria-label="Hủy bỏ" onClick={onClose} className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-sm">Hủy bỏ</button>
          <button
            aria-label="Xác nhận"
            disabled={!receivingUnit || !selectedFile}
            onClick={() => {
              if (requestData?.id) {
                onConfirmHandover(requestData.id, receivingUnit, selectedFile);
              }
              onClose();
            }}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Xác nhận bàn giao
          </button>
        </div>
      </div>
    </div>
  );
}
