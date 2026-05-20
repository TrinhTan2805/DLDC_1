import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Code } from 'lucide-react';
import { ProvisionService } from '../../../../data/provisionServicesData';

interface PacketDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ProvisionService | null;
}

export function PacketDesignModal({ isOpen, onClose, service }: PacketDesignModalProps) {
  const [format, setFormat] = useState('json');
  const [fields, setFields] = useState([
    { id: 1, name: 'id', type: 'string', description: 'Mã định danh' },
    { id: 2, name: 'thoi_gian', type: 'datetime', description: 'Thời gian cập nhật' }
  ]);

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Thiết kế cấu trúc gói tin</h3>
            <p className="text-sm text-slate-500 mt-1">{service.name}</p>
          </div>
          <button title="Đóng" aria-label="Đóng" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50">
          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <h4 className="font-medium text-slate-800 mb-4">Thông tin cấu hình</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Định dạng dữ liệu</label>
                <select title="Tùy chọn" aria-label="Tùy chọn" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="json">JSON</option>
                  <option value="xml">XML</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phương thức phân phối</label>
                <select title="Tùy chọn" aria-label="Tùy chọn" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="api">API / Web Service</option>
                  <option value="file">File chia sẻ (FTP/SFTP)</option>
                  <option value="kafka">Message Queue (Kafka)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-slate-800">Cấu trúc các trường dữ liệu (Fields)</h4>
              <button title="Nút bấm" aria-label="Nút bấm" className="flex items-center text-sm text-amber-600 font-medium hover:text-amber-700">
                <Plus className="w-4 h-4 mr-1" /> Thêm trường
              </button>
            </div>
            
            <div className="overflow-x-auto border border-slate-100 rounded-lg">
              <table className="w-full text-left text-sm min-w-[500px]">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-2 rounded-l-lg font-medium">Tên trường</th>
                    <th className="px-4 py-2 font-medium">Kiểu dữ liệu</th>
                    <th className="px-4 py-2 font-medium">Mô tả</th>
                    <th className="px-4 py-2 rounded-r-lg font-medium w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fields.map(field => (
                    <tr key={field.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3"><input placeholder="..." title="Nhập liệu" aria-label="Trường nhập liệu" type="text" className="w-full px-2 py-1 border border-slate-200 rounded" defaultValue={field.name} /></td>
                      <td className="px-4 py-3">
                        <select title="Tùy chọn" aria-label="Tùy chọn" className="w-full px-2 py-1 border border-slate-200 rounded" defaultValue={field.type}>
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                          <option value="datetime">DateTime</option>
                        </select>
                      </td>
                      <td className="px-4 py-3"><input placeholder="..." title="Nhập liệu" aria-label="Trường nhập liệu" type="text" className="w-full px-2 py-1 border border-slate-200 rounded" defaultValue={field.description} /></td>
                      <td className="px-4 py-3 text-center">
                        <button title="Nút bấm" aria-label="Nút bấm" className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <h4 className="font-medium text-slate-800 mb-4 flex items-center">
              <Code className="w-4 h-4 mr-2 text-slate-500" />
              Cấu trúc mẫu (Preview)
            </h4>
            <pre className="bg-slate-800 text-slate-300 p-4 rounded-lg text-sm overflow-x-auto">
{format === 'json' ? 
`{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "thoi_gian": "2026-05-04T10:00:00Z",
  "...": "..."
}` : 
`<data>
  <id>123e4567-e89b-12d3-a456-426614174000</id>
  <thoi_gian>2026-05-04T10:00:00Z</thoi_gian>
  <!-- ... -->
</data>`
}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-white">
          <button title="Hủy bỏ" aria-label="Hủy bỏ" 
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
          >
            Hủy bỏ
          </button>
          <button title="Lưu cấu hình" aria-label="Lưu cấu hình" 
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center font-medium"
          >
            <Save className="w-4 h-4 mr-2" />
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  );
}
