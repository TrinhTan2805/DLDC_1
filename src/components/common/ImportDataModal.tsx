import { X, Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface ImportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
}

export function ImportDataModal({ isOpen, onClose, onImport }: ImportDataModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [updateMode, setUpdateMode] = useState<'add-and-update' | 'add-only' | 'update-only'>('add-and-update');

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      onImport(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-slate-900">Nhập dữ liệu từ file</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="mb-2">Hỗ trợ định dạng: Excel (.xlsx, .xls), CSV (.csv)</p>
                <p>Dung lượng tối đa: 10MB</p>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-700 mb-2">
              Kéo thả file vào đây hoặc
            </p>
            <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
              Chọn file
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Selected File */}
          {selectedFile && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm text-slate-900">{selectedFile.name}</p>
                <p className="text-xs text-slate-600">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-1 hover:bg-slate-200 rounded transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          )}

          {/* Update Mode Selection */}
          <div className="mt-6 border border-slate-200 rounded-lg p-4">
            <h4 className="text-sm text-slate-900 mb-3">Lựa chọn cập nhật:</h4>
            <div className="space-y-3">
              {/* Option 1: Add and Update */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="updateMode"
                  value="add-and-update"
                  checked={updateMode === 'add-and-update'}
                  onChange={() => setUpdateMode('add-and-update')}
                  className="mt-0.5 w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="text-sm text-slate-900">Thêm mới và cập nhật</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Thêm bản ghi mới nếu chưa tồn tại, cập nhật nếu đã có trong hệ thống
                  </div>
                </div>
              </label>

              {/* Option 2: Add Only */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="updateMode"
                  value="add-only"
                  checked={updateMode === 'add-only'}
                  onChange={() => setUpdateMode('add-only')}
                  className="mt-0.5 w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="text-sm text-slate-900">Thêm mới toàn bộ</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Chỉ thêm các bản ghi mới, bỏ qua các bản ghi đã tồn tại
                  </div>
                </div>
              </label>

              {/* Option 3: Update Only */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="updateMode"
                  value="update-only"
                  checked={updateMode === 'update-only'}
                  onChange={() => setUpdateMode('update-only')}
                  className="mt-0.5 w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="text-sm text-slate-900">Chỉ cập nhật dữ liệu</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Chỉ cập nhật các bản ghi đã tồn tại, không thêm bản ghi mới
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleImport}
            disabled={!selectedFile}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:cursor-not-allowed flex items-center gap-2 disabled:!bg-[#F1F5F9] disabled:!text-[#94A3B8] disabled:!border-[#E2E8F0] disabled:!shadow-none "
          >
            <Upload className="w-4 h-4" />
            Nhập dữ liệu
          </button>
        </div>
      </div>
    </div>
  );
}