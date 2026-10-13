import { toast } from 'sonner';
import { X } from 'lucide-react';

interface ChangeBackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangeBackgroundModal({ isOpen, onClose }: ChangeBackgroundModalProps) {
  if (!isOpen) return null;

  const backgrounds = [
    { id: 1, name: 'Xanh dương nhạt', color: 'bg-blue-50' },
    { id: 2, name: 'Xanh lá nhạt', color: 'bg-green-50' },
    { id: 3, name: 'Tím nhạt', color: 'bg-purple-50' },
    { id: 4, name: 'Cam nhạt', color: 'bg-orange-50' },
    { id: 5, name: 'Xám nhạt', color: 'bg-slate-50' },
    { id: 6, name: 'Trắng', color: 'bg-white' }
  ];

  const handleSelect = (bg: typeof backgrounds[0]) => {
    toast.success(`Đã chọn nền: ${bg.name}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-slate-900">Thay đổi nền giao diện</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-slate-600 mb-4">Chọn màu nền phù hợp với sở thích của bạn</p>
          <div className="grid grid-cols-3 gap-4">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => handleSelect(bg)}
                className={`${bg.color} border-2 border-slate-200 rounded-lg p-6 hover:border-blue-500 transition-colors`}
              >
                <div className="text-center">
                  <div className="text-slate-900 mb-1">{bg.name}</div>
                  <div className="text-xs text-slate-500">Click để chọn</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
