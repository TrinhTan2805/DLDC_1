import { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

interface DataField {
  name: string;
  displayName: string;
  publicLevel: string;
  sensitivityLevel: string;
}

interface DataFieldClassificationProps {
  tableName: string;
  tableSecurityLevel?: string;
}

export function DataFieldClassification({ tableName, tableSecurityLevel = 'noi-bo' }: DataFieldClassificationProps) {
  const [activeTab, setActiveTab] = useState<'clean' | 'normalize' | 'transform'>('clean');
  
  const [cleanFields, setCleanFields] = useState<DataField[]>([
    { name: 'ma_ban_ghi', displayName: 'Mã bản ghi', publicLevel: 'cong-khai-han-che', sensitivityLevel: 'thap' },
    { name: 'ngay_sinh', displayName: 'Ngày sinh', publicLevel: 'noi-bo', sensitivityLevel: 'cao' },
    { name: 'email', displayName: 'Email', publicLevel: 'noi-bo', sensitivityLevel: 'trung-binh' },
    { name: 'so_dien_thoai', displayName: 'Số điện thoại', publicLevel: 'noi-bo', sensitivityLevel: 'trung-binh' },
  ]);

  const [normalizeFields, setNormalizeFields] = useState<DataField[]>([
    { name: 'ho_va_ten', displayName: 'Họ và tên', publicLevel: 'noi-bo', sensitivityLevel: 'cao' },
    { name: 'dia_chi_thuong_tru', displayName: 'Địa chỉ thường trú', publicLevel: 'noi-bo', sensitivityLevel: 'trung-binh' },
    { name: 'so_cccd', displayName: 'Số CCCD', publicLevel: 'mat', sensitivityLevel: 'rat-cao' },
  ]);

  const [transformFields, setTransformFields] = useState<DataField[]>([
    { name: 'tuoi', displayName: 'Tuổi (tính từ ngày sinh)', publicLevel: 'cong-khai-han-che', sensitivityLevel: 'thap' },
    { name: 'ma_vung', displayName: 'Mã vùng (từ địa chỉ)', publicLevel: 'cong-khai-toan-bo', sensitivityLevel: 'thap' },
    { name: 'loai_giay_to', displayName: 'Loại giấy tờ', publicLevel: 'noi-bo', sensitivityLevel: 'trung-binh' },
  ]);

  const getCurrentFields = () => {
    switch (activeTab) {
      case 'clean': return cleanFields;
      case 'normalize': return normalizeFields;
      case 'transform': return transformFields;
      default: return cleanFields;
    }
  };

  const setCurrentFields = (fields: DataField[]) => {
    switch (activeTab) {
      case 'clean': setCleanFields(fields); break;
      case 'normalize': setNormalizeFields(fields); break;
      case 'transform': setTransformFields(fields); break;
    }
  };

  const handleFieldChange = (index: number, field: keyof DataField, value: string) => {
    const currentFields = getCurrentFields();
    const updatedFields = [...currentFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setCurrentFields(updatedFields);
  };

  const handleSave = () => {
    alert('Đã lưu cấu hình phân loại dữ liệu!');
  };

  const publicLevelColors: { [key: string]: string } = {
    'cong-khai-toan-bo': 'bg-green-50 text-green-700 border-green-200',
    'cong-khai-han-che': 'bg-blue-50 text-blue-700 border-blue-200',
    'noi-bo': 'bg-amber-50 text-amber-700 border-amber-200',
    'mat': 'bg-red-50 text-red-700 border-red-200',
  };

  const sensitivityLevelColors: { [key: string]: string } = {
    'thap': 'bg-green-50 text-green-700 border-green-200',
    'trung-binh': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'cao': 'bg-orange-50 text-orange-700 border-orange-200',
    'rat-cao': 'bg-red-50 text-red-700 border-red-200',
  };

  const getSecurityLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      'mo': 'Dữ liệu mở',
      'noi-bo': 'Dữ liệu nội bộ',
      'han-che': 'Dữ liệu hạn chế',
      'nhay-cam': 'Dữ liệu nhạy cảm',
      'bao-mat': 'Dữ liệu bảo mật',
      'tuyet-mat': 'Dữ liệu tuyệt mật',
    };
    return labels[level] || level;
  };

  const getTabColor = (tab: 'clean' | 'normalize' | 'transform') => {
    if (tab === 'clean') return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-600', activeBg: 'bg-red-600' };
    if (tab === 'normalize') return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-600', activeBg: 'bg-yellow-600' };
    return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-600', activeBg: 'bg-green-600' };
  };

  const getTabDescription = () => {
    if (activeTab === 'clean') return 'Xác định mức độ bảo mật cho các trường cần làm sạch (loại bỏ lỗi, xử lý giá trị null, format không đúng)';
    if (activeTab === 'normalize') return 'Xác định mức độ bảo mật cho các trường cần chuẩn hóa (chuyển đổi định dạng, hợp nhất dữ liệu trùng lặp)';
    return 'Xác định mức độ bảo mật cho các trường được tạo mới từ quá trình biến đổi (tính toán, trích xuất, mapping)';
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-slate-900">Phân loại Mức độ Bảo mật Trường Dữ liệu</h3>
            <p className="text-sm text-slate-600 mt-1">Bảng: {tableName}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-lg text-sm border ${
              tableSecurityLevel === 'nhay-cam' 
                ? 'bg-red-50 text-red-700 border-red-200'
                : tableSecurityLevel === 'bao-mat'
                ? 'bg-orange-50 text-orange-700 border-orange-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              Bảng: {getSecurityLevelLabel(tableSecurityLevel)}
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Lưu cấu hình
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex px-6 gap-2">
          <button
            onClick={() => setActiveTab('clean')}
            className={`px-4 py-3 text-sm transition-all relative ${
              activeTab === 'clean'
                ? 'text-red-700 border-b-2 border-red-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dữ liệu Làm sạch
            <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
              activeTab === 'clean' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {cleanFields.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('normalize')}
            className={`px-4 py-3 text-sm transition-all relative ${
              activeTab === 'normalize'
                ? 'text-yellow-700 border-b-2 border-yellow-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dữ liệu Chuẩn hóa
            <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
              activeTab === 'normalize' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {normalizeFields.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('transform')}
            className={`px-4 py-3 text-sm transition-all relative ${
              activeTab === 'transform'
                ? 'text-green-700 border-b-2 border-green-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dữ liệu Biến đổi
            <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
              activeTab === 'transform' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {transformFields.length}
            </span>
          </button>
        </div>
      </div>

      {/* Alert */}
      <div className={`px-6 py-3 border-b ${
        activeTab === 'clean' ? 'bg-red-50 border-red-100' :
        activeTab === 'normalize' ? 'bg-yellow-50 border-yellow-100' :
        'bg-green-50 border-green-100'
      }`}>
        <div className="flex items-start gap-3">
          <AlertCircle className={`w-4 h-4 mt-0.5 ${
            activeTab === 'clean' ? 'text-red-600' :
            activeTab === 'normalize' ? 'text-yellow-600' :
            'text-green-600'
          }`} />
          <div className="flex-1">
            <p className={`text-sm ${
              activeTab === 'clean' ? 'text-red-800' :
              activeTab === 'normalize' ? 'text-yellow-800' :
              'text-green-800'
            }`}>
              <strong>Giai đoạn {activeTab === 'clean' ? 'Làm sạch' : activeTab === 'normalize' ? 'Chuẩn hóa' : 'Biến đổi'}:</strong> {getTabDescription()}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider w-1/4">
                Tên trường
              </th>
              <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider w-1/3">
                Mức độ công khai
              </th>
              <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider w-1/3">
                Mức độ nhạy cảm
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {getCurrentFields().map((field, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm text-slate-900">{field.displayName}</div>
                    <div className="text-xs text-slate-500 font-mono">{field.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select aria-label="Select box"
                    value={field.publicLevel}
                    onChange={(e) => handleFieldChange(index, 'publicLevel', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${publicLevelColors[field.publicLevel] || 'bg-white text-slate-700 border-slate-300'}`}
                  >
                    <option value="">Chọn mức độ</option>
                    <option value="cong-khai-toan-bo">Công khai toàn bộ</option>
                    <option value="cong-khai-han-che">Công khai hạn chế</option>
                    <option value="noi-bo">Nội bộ</option>
                    <option value="mat">Mật</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <select aria-label="Select box"
                    value={field.sensitivityLevel}
                    onChange={(e) => handleFieldChange(index, 'sensitivityLevel', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${sensitivityLevelColors[field.sensitivityLevel] || 'bg-white text-slate-700 border-slate-300'}`}
                  >
                    <option value="">Chọn mức độ</option>
                    <option value="thap">Thấp</option>
                    <option value="trung-binh">Trung bình</option>
                    <option value="cao">Cao</option>
                    <option value="rat-cao">Rất cao</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer với legend */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
        <div className="grid grid-cols-2 gap-6">
          {/* Legend Mức độ công khai */}
          <div>
            <h4 className="text-xs text-slate-600 uppercase tracking-wider mb-2">Mức độ công khai:</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span className="text-xs text-slate-700">Công khai toàn bộ - Không hạn chế truy cập</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-xs text-slate-700">Công khai hạn chế - Có điều kiện truy cập</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                <span className="text-xs text-slate-700">Nội bộ - Chỉ nội bộ cơ quan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <span className="text-xs text-slate-700">Mật - Hạn chế nghiêm ngặt</span>
              </div>
            </div>
          </div>

          {/* Legend Mức độ nhạy cảm */}
          <div>
            <h4 className="text-xs text-slate-600 uppercase tracking-wider mb-2">Mức độ nhạy cảm:</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span className="text-xs text-slate-700">Thấp - Thông tin công khai cơ bản</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                <span className="text-xs text-slate-700">Trung bình - Cần kiểm soát truy cập</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                <span className="text-xs text-slate-700">Cao - Thông tin cá nhân quan trọng</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <span className="text-xs text-slate-700">Rất cao - Thông tin nhạy cảm đặc biệt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}