import { useState, useEffect, ChangeEvent } from 'react';
import { X, Save, AlertCircle, CheckCircle2, Loader2, Database } from 'lucide-react';
import { Portal } from '../../../../common/Portal';

interface RecordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  title: string;
}

export function RecordFormModal({ isOpen, onClose, onSave, initialData, title }: RecordFormModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    status: 'active',
    approver: ''
  });

  const [isValidating, setIsValidating] = useState(false);
  const [errorObj, setErrorObj] = useState<Record<string, string>>({});
  const [checkResult, setCheckResult] = useState<'none' | 'valid' | 'conflict'>('none');

  // Mock list of approvers for form
  const approvers = [
    { id: 'approver1', name: 'Hoàng Văn E', role: 'Trưởng phòng Công nghệ thông tin' },
    { id: 'approver2', name: 'Nguyễn Thị F', role: 'Phó phòng CNTT' },
  ];

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          code: initialData.code || '',
          name: initialData.name || '',
          description: initialData.description || '',
          status: initialData.status || 'active',
          approver: ''
        });
      } else {
        setFormData({
          code: '',
          name: '',
          description: '',
          status: 'active',
          approver: ''
        });
      }
      setErrorObj({});
      setCheckResult('none');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorObj[name]) {
      setErrorObj(prev => ({ ...prev, [name]: '' }));
    }
    setCheckResult('none');
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.code.trim()) newErrors.code = 'Mã bản ghi không được để trống';
    if (!formData.name.trim()) newErrors.name = 'Tên bản ghi không được để trống';
    
    if (Object.keys(newErrors).length > 0) {
      setErrorObj(newErrors);
      return;
    }

    // UX validation check
    setIsValidating(true);
    setCheckResult('none');

    setTimeout(() => {
      setIsValidating(false);
      
      // Simulate conflict check - Let's mock: If code is exactly 'ERROR', it fails.
      if (formData.code.toUpperCase() === 'ERROR') {
        setCheckResult('conflict');
        return;
      }

      setCheckResult('valid');
      
      // Delay before actual save for success UX
      setTimeout(() => {
        onSave(formData);
      }, 700);

    }, 1500);
  };

  return (
    <Portal>
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4" 
        style={{ zIndex: 99999 }}
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-2 rounded-xl transition-colors"
              title="Đóng modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 space-y-6">
            {checkResult === 'conflict' && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl mb-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Lỗi tính hợp lệ</h4>
                  <p className="text-sm mt-1">Mã bản ghi "{formData.code}" đã tồn tại trong hệ thống. Vui lòng sử dụng mã khác để tránh trùng lặp dữ liệu!</p>
                </div>
              </div>
            )}

            {checkResult === 'valid' && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl mb-4">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold text-sm">Dữ liệu hợp lệ. Đang lưu vào hệ thống...</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mã bản ghi (Tự nhiên) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:bg-white text-sm font-medium transition-all ${errorObj.code ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'}`}
                  placeholder="Nhập mã định danh..."
                  disabled={isValidating || checkResult === 'valid'}
                />
                {errorObj.code && <p className="text-sm text-red-600 mt-1">{errorObj.code}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Giá trị / Tên bản ghi <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:bg-white text-sm font-medium transition-all ${errorObj.name ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'}`}
                  placeholder="Nhập tên hiển thị bản ghi..."
                  disabled={isValidating || checkResult === 'valid'}
                />
                {errorObj.name && <p className="text-sm text-red-600 mt-1">{errorObj.name}</p>}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả thêm / Diễn giải</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                  placeholder="Nhập các chi tiết, định nghĩa bổ sung..."
                  disabled={isValidating || checkResult === 'valid'}
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Trạng thái phát hành</label>
                <select
                  name="status"
                  title="Trạng thái"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                  disabled={isValidating || checkResult === 'valid'}
                >
                  <option value="active">Đang áp dụng (Active)</option>
                  <option value="inactive">Ngừng áp dụng (Inactive)</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Người xem xét yêu cầu</label>
                <select
                  name="approver"
                  title="Người duyệt"
                  value={formData.approver}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                  disabled={isValidating || checkResult === 'valid'}
                >
                  <option value="">-- Chọn cán bộ duyệt phê chuẩn --</option>
                  {approvers.map(a => <option key={a.id} value={a.id}>{a.name} - {a.role}</option>)}
                </select>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4 flex gap-3 text-blue-700 mt-6 border border-blue-100">
              <Database className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-80" />
              <p className="text-sm">Bản ghi này sẽ tự động kế thừa cấu trúc ràng buộc dữ liệu được thiết lập ở màn hình Quản lý Danh mục gốc.</p>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 rounded-b-2xl">
            <button
 onClick={onClose}
 disabled={isValidating || checkResult === 'valid'}
 className="px-6 py-2.5 text-sm text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
 >
              Hủy bỏ
            </button>
            <button
 onClick={handleSave}
 disabled={isValidating || checkResult === 'valid'}
 className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px]"
 >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang kiểm tra...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Lưu bản ghi
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
